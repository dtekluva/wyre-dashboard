import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const fuelUsageData = [
  { day: "Mon", liters: 220 },
  { day: "Tue", liters: 280 },
  { day: "Wed", liters: 160 },
  { day: "Thu", liters: 360 },
  { day: "Fri", liters: 310 },
  { day: "Sat", liters: 260 },
  { day: "Sun", liters: 190 },
];

const FuelUsageCard = () => {
  return (
    <div className="card">
      <h3 className="card-title">Fuel Usage</h3>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={fuelUsageData}
            barCategoryGap="30%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(val) => [`${val} L`, "Fuel"]} />
            <Bar dataKey="liters" fill="#5C12A7" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FuelUsageCard;