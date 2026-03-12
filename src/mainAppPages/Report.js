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
    <div className="report-page">
      <header className="report-page__header">
        <p className="report-page__subtitle">
          Generate daily, periodic, or monthly reports for your branch.
        </p>
      </header>

      <section className="report-page__controls">
        <div className="report-type-tabs" role="tablist" aria-label="Report type">
          {["daily", "periodic", "monthly"].map((type) => (
            <button
              key={type}
              role="tab"
              aria-selected={reportType === type}
              className={`tab-btn ${reportType === type ? "active" : ""}`}
              onClick={() => setReportType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {reportType === "daily" && (
          <div className="report-page__date-group">
            <label htmlFor="report-daily-date" className="report-page__label">
              Select date
            </label>
            <input
              id="report-daily-date"
              type="date"
              className="report-page__date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        )}

        {reportType === "periodic" && (
          <div className="report-page__date-range">
            <div className="report-page__date-group">
              <label htmlFor="report-start-date" className="report-page__label">
                Start date
              </label>
              <input
                id="report-start-date"
                type="date"
                className="report-page__date-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="report-page__date-group">
              <label htmlFor="report-end-date" className="report-page__label">
                End date
              </label>
              <input
                id="report-end-date"
                type="date"
                className="report-page__date-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        )}
      </section>

      {reportType !== "monthly" && reportContext && (
        <section className="report-page__preview" aria-label="Report preview">
          <ReportIframePreview reportContext={reportContext} />
        </section>
      )}

      {reportType === "monthly" && (
        <section className="report-page__monthly" aria-label="Monthly report">
          <MonthlyReport
            branchId={branchId}
            setReportContext={setReportContext}
          />
        </section>
      )}

      <section className="report-page__send" aria-label="Send report">
        <SendReportPanel reportContext={reportContext} />
      </section>
    </div>
  );
};

export default Report;