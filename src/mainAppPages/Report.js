import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SendReportPanel from "../components/SendReportPanel";
import MonthlyReport from "../components/MonthlyReport ";
import ReportIframePreview from "../components/ReportIframePreview";

const Report = () => {
  const sideBar = useSelector((state) => state.sideBar);
  const branchId = sideBar?.sideBarData?.branches?.[0]?.branch_id;

  const [reportType, setReportType] = useState("daily");

  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ SINGLE SOURCE OF CONTEXT
  const [reportContext, setReportContext] = useState(null);

  // ✅ DAILY + PERIODIC AUTO CONTEXT
  useEffect(() => {
    if (!branchId) {
      setReportContext(null);
      return;
    }

    if (reportType === "daily" && date) {
      setReportContext({
        report_type: "daily",
        branch_id: branchId,
        date,
      });
    }

    if (reportType === "periodic" && startDate && endDate) {
      setReportContext({
        report_type: "periodic",
        branch_id: branchId,
        start_date: startDate,
        end_date: endDate,
      });
    }
  }, [reportType, branchId, date, startDate, endDate]);

  return (
    <div>
      {/* REPORT TYPE SELECTOR */}
      <div className="report-type-tabs">
        {["daily", "periodic", "monthly"].map((type) => (
          <button
            key={type}
            className={`tab-btn ${reportType === type ? "active" : ""}`}
            onClick={() => setReportType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* DATE INPUTS */}
      {reportType === "daily" && (
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      )}

      {reportType === "periodic" && (
        <>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </>
      )}

      {/* PREVIEW */}
      {reportType !== "monthly" && reportContext && (
        <ReportIframePreview reportContext={reportContext} />
      )}

      {/* MONTHLY */}
      {reportType === "monthly" && (
        <MonthlyReport
          branchId={branchId}
          setReportContext={setReportContext}
        />
      )}

      {/* SEND */}
      <SendReportPanel reportContext={reportContext} />
    </div>
  );
};

export default Report;