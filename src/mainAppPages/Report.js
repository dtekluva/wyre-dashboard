import { useEffect, useMemo, useState } from "react";
import { Select } from "antd";
import { useSelector } from "react-redux";
import SendReportPanel from "../components/SendReportPanel";
import MonthlyReport from "../components/MonthlyReport ";
import ReportIframePreview from "../components/ReportIframePreview";

const { Option } = Select;

const getPreviousMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return {
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
};

const Report = () => {
  const sideBar = useSelector((state) => state.sideBar);
  const branchId = sideBar?.sideBarData?.branches?.[0]?.branch_id;

  const [reportType, setReportType] = useState("daily");

  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDate, setSelectedDate] = useState(getPreviousMonth);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const monthOptions = useMemo(
    () =>
      [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
      ].map((option) => ({
        ...option,
        disabled:
          selectedDate.year === currentYear && option.value > currentMonth,
      })),
    [selectedDate.year, currentYear, currentMonth]
  );

  const yearOptions = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const year = currentYear - i;
        return {
          value: year,
          label: year.toString(),
          disabled: year > currentYear,
        };
      }),
    [currentYear]
  );

  // ✅ SINGLE SOURCE OF CONTEXT
  const [reportContext, setReportContext] = useState(null);

  // ✅ DAILY + PERIODIC + MONTHLY AUTO CONTEXT
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

    if (reportType === "monthly" && selectedDate.month && selectedDate.year) {
      setReportContext({
        report_type: "monthly",
        branch_id: branchId,
        month: selectedDate.month,
        year: selectedDate.year,
      });
    }
  }, [reportType, branchId, date, startDate, endDate, selectedDate]);

  return (
    <div className="report-page">
      <header className="report-page__header">
        <h1 className="report-page__title">Reports</h1>
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

        {reportType === "monthly" && (
          <div className="report-page__date-range">
            <div className="report-page__date-group">
              <label htmlFor="report-monthly-year" className="report-page__label">
                Year
              </label>
              <Select
                id="report-monthly-year"
                className="report-page__select"
                value={selectedDate.year}
                onChange={(value) =>
                  setSelectedDate((prev) => ({ ...prev, year: value }))
                }
                placeholder="Select Year"
              >
                {yearOptions.map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="report-page__date-group">
              <label htmlFor="report-monthly-month" className="report-page__label">
                Month
              </label>
              <Select
                id="report-monthly-month"
                className="report-page__select"
                value={selectedDate.month}
                onChange={(value) =>
                  setSelectedDate((prev) => ({ ...prev, month: value }))
                }
                placeholder="Select Month"
              >
                {monthOptions.map((option) => (
                  <Option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </Option>
                ))}
              </Select>
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
            month={selectedDate.month}
            year={selectedDate.year}
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