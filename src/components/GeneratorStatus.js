// src/components/GeneratorStatus.jsx
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { dieselData } from "../data/dieselData";

const GeneratorStatus = () => {
  const COLORS = ["#6D28D9", "#FACC15"]; // purple, yellow
  const { generators } = dieselData;

  const runHours = [
    { name: generators[0].name, value: 22 },
    { name: generators[1].name, value: 18 },
  ];

  const fuelUsed = [
    { name: generators[0].name, value: generators[0].fuelUsed },
    { name: generators[1].name, value: generators[1].fuelUsed },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Run Hours */}
      <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center">
        <h3 className="text-sm text-gray-600 mb-2">Run Hours</h3>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={runHours} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
              {runHours.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2">39h 59m 60s</p>
      </div>

      {/* Fuel Used */}
      <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center">
        <h3 className="text-sm text-gray-600 mb-2">Fuel Used</h3>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={fuelUsed} innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
              {fuelUsed.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <p className="text-xs mt-2">30 Litres</p>
      </div>
    </div>
  );
};

export default GeneratorStatus;