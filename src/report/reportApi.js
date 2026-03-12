import axios from "axios";
import { APIService } from "../config/api/apiConfig";

const BACKEND_URL = "https://backend.wyreng.com/api/v1";

export const fetchReportData = async (branchId, month, year) => {
  const startTime = performance.now();
  console.log(
    `[Report API] Starting data fetch for branch ID: ${branchId} at ${new Date().toISOString()}`
  );

  try {
    if (!branchId) {
      throw new Error("Branch ID is required");
    }

    // Ensure month is a number between 1-12
    const monthNumber = parseInt(month);
    if (isNaN(monthNumber) || monthNumber < 1 || monthNumber > 12) {
      throw new Error("Invalid month");
    }

    let url = `${BACKEND_URL}/generate-report/?branch_id=${branchId}&month=${monthNumber}&year=${year}`;
    console.log(`[Report API] Making request to: ${url}`);

    const response = await axios.get(url);
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.log(
      `[Report API] Data fetched successfully in ${duration.toFixed(2)}ms`
    );
    console.log(
      `[Report API] Response data size: ${
        JSON.stringify(response.data).length
      } characters`
    );

    return response.data;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    console.error(
      `[Report API] Error fetching report data after ${duration.toFixed(2)}ms:`,
      error
    );
    throw error;
  }
};

// Fetch report preview (HTML email)
export const fetchReportPreview = async ({
  reportType,
  branchId,
  month,
  year,
  startDate,
  endDate,
  date
}) => {
  if (!branchId) throw new Error("Branch ID is required");
  if (!reportType) throw new Error("Report type is required");

  let url = `${BACKEND_URL}/preview-report/?report_type=${reportType}&branch_id=${branchId}`;

  // Monthly
  if (reportType === "monthly") {
    url += `&month=${month}&year=${year}`;
  }

  // Periodic
  if (reportType === "periodic") {
    url += `&start_date=${startDate}&end_date=${endDate}`;
  }

  // Daily
  if (reportType === "daily") {
    url += `&date=${date}`;
  }

  const response = await APIService.get(url);

  // Expecting { html_email: "<html>...</html>" }
  return response.data.html_email;
};

// Send report via email
export const sendReport = async ({
  reportType,
  branchId,
  recipient,
  month,
  year,
  startDate,
  endDate,
  date
}) => {
  if (!branchId) throw new Error("Branch ID is required");
  if (!reportType) throw new Error("Report type is required");

  const payload = {
    branch_id: branchId,
    report_type: reportType,
    recipient
  };

  if (reportType === "monthly") {
    payload.month = month;
    payload.year = year;
  }

  if (reportType === "periodic") {
    payload.start_date = startDate;
    payload.end_date = endDate;
  }

  if (reportType === "daily") {
    payload.date = date;
  }

  const response = await APIService.post(
    `${BACKEND_URL}/forward-report/`,
    payload
  );

  console.log("SEND REPORT PAYLOAD:", payload);

  return response.data;
};


export const previewReport = async (context) => {
  const params = new URLSearchParams(context).toString();

  return APIService.get(
    `${BACKEND_URL}/preview-report/?${params}`
  );
};

export const sendingReport = async (context, carbonCopy = []) => {
  return APIService.post(
    `${BACKEND_URL}/forward-report/`,
    {
      ...context,
      carbon_copy: carbonCopy,
    }
  );
};
