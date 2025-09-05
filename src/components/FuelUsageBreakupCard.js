import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const generatorFuelUsageData = [
  { day: "Mon", genA: 120, genB: 100 },
  { day: "Tue", genA: 150, genB: 130 },
  { day: "Wed", genA: 90, genB: 70 },
  { day: "Thu", genA: 200, genB: 160 },
  { day: "Fri", genA: 170, genB: 140 },
  { day: "Sat", genA: 140, genB: 120 },
  { day: "Sun", genA: 100, genB: 90 },
];

const FuelUsageBreakupCard = () => {
  return (
    <div className="card">
      <h3 className="card-title">Generator Fuel Usage</h3>
      <div className="card-body">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={generatorFuelUsageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip 
              formatter={(val) => [`${val} L`, "Fuel"]}
              contentStyle={{ backgroundColor: '#333', borderRadius: '8px', border: 'none' }}
              // itemStyle={{ color: '#fff' }}
              labelStyle={{ color: '#ccc' }}
            />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="genA"
              stroke="#E74C3C"
              strokeWidth={2}
              name="Gen A"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="genB"
              stroke="#52AC0B"
              strokeWidth={2}
              name="Gen B"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FuelUsageBreakupCard;