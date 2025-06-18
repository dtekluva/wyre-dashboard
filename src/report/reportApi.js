import axios from "axios";

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
