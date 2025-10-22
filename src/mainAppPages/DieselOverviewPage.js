import React, { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import DieselHeader from "../components/DieselHeader";
import GeneratorStatus2 from "../components/GeneratorStatus2";
import TotalEnergyUsed from "../components/TotalEnergyUsed";
import FuelUsageBreakupCard from "../components/FuelUsageBreakupCard";
import FuelUsageCard from "../components/FuelUsageCard";
import OperationalEfficiencyCard from "../components/OperationalEfficiencyCard";
import CostAnalysisCard from "../components/CostAnalysisCard";
import BreadCrumb from "../components/BreadCrumb";
import { DatePicker, message } from "antd";
import { connect } from "react-redux";
import {
  fetchBranchGeneratorsStatusData,
  fetchCoEmissionData,
  fetchCostMetricsData,
  fetchDieselPriceData,
  fetchFuelUsageData,
  fetchGenFuelUsageData,
  fetchGenMetricsData,
  fetchGenStatusChartData,
  fetchGenTotalEnergyUsedData,
} from "../redux/actions/diesel/diesel.action";
import dayjs from "dayjs";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "#", name: "Diesel Overview", id: 2 },
];

const DieselOverviewPage = ({
  diesel,
  fetchBranchGeneratorsStatusData,
  fetchGenTotalEnergyUsedData,
  fetchDieselPriceData,
  fetchCoEmissionData,
  fetchCostMetricsData,
  fetchFuelUsageData,
  fetchGenFuelUsageData,
  fetchGenStatusChartData,
  fetchGenMetricsData,
}) => {
  const [branchGenStatusData, setBranchGenStatusData] = useState(null);
  const [genCo2EmissionData, setGenCo2EmissionData] = useState(null);
  const [dieselPriceData, setDieselPriceData] = useState({});
  const [genTotalEnergyUsedData, setGenTotalEnergyUsedData] = useState(null);
  const [genStatusChartData, setGenStatusChartData] = useState(null);
  const [genFuelUsageData, setGenFuelUsageData] = useState(null);
  const [fuelUsageData, setFuelUsageData] = useState(null);
  const [operationalEfficiencyData, setOperationalEfficiencyData] = useState(null);
  const [costAnalysisData, setCostAnalysisData] = useState(null);

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [frequency, setFrequency] = useState("daily");
  const [isDownloading, setIsDownloading] = useState(false);
  const dashboardRef = useRef(null);

  useEffect(() => {
    fetchBranchGeneratorsStatusData();
    fetchDieselPriceData();
    fetchCoEmissionData();
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    fetchGenTotalEnergyUsedData(selectedDate);
    fetchGenStatusChartData(selectedDate);
    fetchGenFuelUsageData(selectedDate);
    fetchFuelUsageData(selectedDate);
    fetchGenMetricsData(selectedDate);
    fetchCostMetricsData(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (diesel) {
      setBranchGenStatusData(diesel.branchGeneratorsStatusData);
      setGenCo2EmissionData(diesel.co2EmissionData);
      setDieselPriceData(diesel.dieselPriceData);
      setGenTotalEnergyUsedData(diesel.branchGeneratorMonthlyEnergyData);
      setGenStatusChartData(diesel.genStatusChartData);
      setGenFuelUsageData(diesel.genFuelUsageData);
      setFuelUsageData(diesel.fuelUsageData);
      setOperationalEfficiencyData(diesel.operationalEfficiencyData);
      setCostAnalysisData(diesel.costAnalysisData);
    }
  }, [diesel]);

  // const handleDownloadPDF = async () => {
  //   try {
  //     setIsDownloading(true);
  //     message.loading({ content: "Downloading diesel usage...", key: "download" });

  //     await new Promise((res) => setTimeout(res, 400));

  //     const element = dashboardRef.current;
  //     const canvas = await html2canvas(element, {
  //       scale: 2,
  //       useCORS: true,
  //       ignoreElements: (el) => el.classList.contains("no-print"),
  //     });

  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "mm", "a4");
  //     const pageWidth = pdf.internal.pageSize.getWidth();
  //     const imgProps = pdf.getImageProperties(imgData);
  //     const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

  //     const title = `${
  //       frequency === "monthly" ? "Monthly" : "Daily"
  //     } Diesel Usage for ${dayjs(selectedDate).format("MMMM YYYY")}`;

  //     pdf.setFont("helvetica", "bold");
  //     pdf.setFontSize(16);
  //     pdf.text(title, pageWidth / 2, 15, { align: "center" });

  //     pdf.addImage(imgData, "PNG", 0, 25, pageWidth, pdfHeight);
  //     pdf.save(`Diesel_Usage_${dayjs(selectedDate).format("MMM_YYYY")}.pdf`);

  //     message.success({ content: "Download complete!", key: "download", duration: 2 });
  //   } catch (err) {
  //     console.error("PDF generation failed:", err);
  //     message.error({ content: "Failed to generate PDF", key: "download", duration: 2 });
  //   } finally {
  //     setIsDownloading(false);
  //   }
  // };

  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      await new Promise((res) => setTimeout(res, 300));

      const element = dashboardRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        ignoreElements: (el) => el.classList.contains("no-print"),
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const pdfHeight = (imgProps.height * pageWidth) / imgProps.width;

      // Title
      const title = `${frequency === "monthly" ? "Monthly" : "Daily"
        } Diesel Usage – ${dayjs(selectedDate).format("MMMM YYYY")}`;
      pdf.setFontSize(16);
      pdf.text(title, pageWidth / 2, 15, { align: "center" });

      // Add captured dashboard
      pdf.addImage(imgData, "PNG", 0, 25, pageWidth, pdfHeight);

      // ✅ Add watermark text
      const watermarkText = "Wyreng Energy";
      pdf.setFontSize(50);
      pdf.setTextColor(150, 150, 150);
      pdf.setDrawColor(255, 255, 255);
      pdf.setGState(new pdf.GState({ opacity: 0.15 }));
      pdf.text(
        watermarkText,
        pageWidth / 2,
        pageHeight / 2,
        { align: "center", angle: 45 }
      );

      pdf.save(`Diesel_Usage_${dayjs(selectedDate).format("MMM_YYYY")}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      {/* Header controls */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <BreadCrumb routesArray={breadCrumbRoutes} />
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          style={{
            // backgroundColor: "#5C12A7",
            backgroundColor: "#5c3592",
            color: "#fff",
            padding: "8px 20px",
            whiteSpace: "nowrap",
            border: "none",
            borderRadius: "6px",
            cursor: isDownloading ? "not-allowed" : "pointer",
            fontWeight: 500,
          }}
        >
          {isDownloading ? "Downloading diesel usage..." : "Download PDF"}
        </button>
      </div>

      {/* Dashboard content */}
      <div
        ref={dashboardRef}
        className="diesel"
        style={{
          padding: "30px",
          backgroundColor: "#F2F2FA",
          borderRadius: "16px",
        }}
      >
        <h3
          className="no-print"
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
            fontWeight: "600",
          }}
        >
          {frequency === "monthly"
            ? `Monthly Diesel Usage for ${dayjs(selectedDate).format("MMMM YYYY")}`
            : `Daily Diesel Usage for ${dayjs(selectedDate).format("MMMM YYYY")}`}
        </h3>

        <DieselHeader
          dieselPrice={dieselPriceData}
          genStatus={branchGenStatusData}
          Co2={genCo2EmissionData}
          loader={diesel}
        />

        <div
          className="no-print"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "20px 0 15px 0",
          }}
        >
          <DatePicker
            picker="month"
            value={dayjs(selectedDate)}
            onChange={(value) => value && setSelectedDate(value.toDate())}
          />
        </div>

        {/* Section 1 */}
        <div className="diesel-grid1">
          <div className="grid1-item card">
            <TotalEnergyUsed
              genTotalEnergyUsedData={genTotalEnergyUsedData}
              loader={diesel.branchGeneratorMonthlyEnergyLoading}
            />
          </div>
          <div className="grid1-item card">
            <GeneratorStatus2
              genStatusChartData={genStatusChartData}
              loader={diesel.genStatusChartLoading}
            />
          </div>
        </div>

        {/* Section 2 */}
        <div className="diesel-grid2">
          <div className="card">
            <FuelUsageBreakupCard
              genFuelUsageData={genFuelUsageData}
              loader={diesel.genFuelUsageLoading}
            />
          </div>
          <div className="card">
            <FuelUsageCard
              fetchFuelUsageData={fetchFuelUsageData}
              fuelUsageData={fuelUsageData}
              loader={diesel.fuelUsageLoading}
            />
          </div>
        </div>

        {/* Section 3 */}
        <div className="diesel-grid3">
          <div className="card">
            <OperationalEfficiencyCard
              operationalEfficiencyData={operationalEfficiencyData}
              loader={diesel.operationalEfficiencyLoading}
            />
          </div>
          <div className="card">
            <CostAnalysisCard
              costAnalysisData={costAnalysisData}
              loader={diesel.costAnalysisLoading}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const mapDispatchToProps = {
  fetchBranchGeneratorsStatusData,
  fetchGenTotalEnergyUsedData,
  fetchDieselPriceData,
  fetchCoEmissionData,
  fetchGenStatusChartData,
  fetchGenFuelUsageData,
  fetchFuelUsageData,
  fetchGenMetricsData,
  fetchCostMetricsData,
};

const mapStateToProps = (state) => ({
  diesel: state.dieselReducer,
});

export default connect(mapStateToProps, mapDispatchToProps)(DieselOverviewPage);