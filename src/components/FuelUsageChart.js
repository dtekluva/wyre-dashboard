// src/components/FuelUsageChart.jsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { dieselData } from "../data/dieselData";

const FuelUsageChart = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h3 className="font-semibold mb-3">Fuel usage</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={dieselData.charts.fuelUsage}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="fuel" fill="#6D28D9" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuelUsageChart;