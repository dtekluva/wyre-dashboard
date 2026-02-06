// src/components/FuelBreakupChart.jsx
import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { dieselData } from "../data/dieselData";

const FuelBreakupChart = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4">
      <h3 className="font-semibold mb-3">Generator fuel usage breakup</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={dieselData.charts.fuelBreakup}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="gen001" stroke="#6D28D9" strokeWidth={2} />
          <Line type="monotone" dataKey="gen002" stroke="#FACC15" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FuelBreakupChart;