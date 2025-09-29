import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Spin } from "antd";

const FuelUsageCard = ({ fetchFuelUsageData, fuelUsageData, loader }) => {
  const [frequency, setFrequency] = useState("daily");

  const formatDate = (str) => {
    const d = new Date(str);
    if (isNaN(d)) return str;

    if (frequency === "monthly") {
      return d.toLocaleString("default", { month: "short", year: "numeric" }); // e.g. Sep
    } else {
      return `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`; // e.g. Sep 15
    }
  }; 
  const handleDailyView = () => {
    setFrequency("daily");
    fetchFuelUsageData(new Date(), "daily"); // or pass the currently selected date
  };

  const handleMonthlyView = () => {
    setFrequency("monthly");
    fetchFuelUsageData(new Date(), "monthly"); // or pass the currently selected date
  };
  return (
    <div className="card">
      <Spin spinning={loader}>
        <div className="card-header">
          <h3 className="card-title">Fuel Usage</h3>
          <div className="fub-toggle">
            <button
              className={frequency === "daily" ? "fub-toggle-btn active" : "fub-toggle-btn"}
              onClick={handleDailyView}
              type="button"
            >
              Daily
            </button>
            <button
              className={frequency === "monthly" ? "fub-toggle-btn active" : "fub-toggle-btn"}
              onClick={handleMonthlyView}
              type="button"
            >
              Monthly
            </button>
          </div>
        </div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={fuelUsageData?.data?.series}
              barCategoryGap="30%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date"
                fontSize={3}
                tickFormatter={formatDate}
                angle={-40}
                textAnchor="end"
                height={65}
              />
              <YAxis 
                label={{ value: "Fuel Used", angle: -90, position: "insideLeft" }}
              />
              <Tooltip formatter={(val) => [`${val} L`, "Fuel"]} />
              <Bar dataKey="fuel_liters" fill="#5C12A7" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Spin>
    </div>
  );
};

export default FuelUsageCard;