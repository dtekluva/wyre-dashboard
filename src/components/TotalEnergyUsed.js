import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const TotalEnergyUsed = () => {
  const data = [
    { name: "Gen 001", value: 65.1, color: "#5C12A7" }, // purple
    { name: "Gen 002", value: 48.9, color: "#FCCC43" }, // yellow
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="total-energy-card">
      <h3 className="card-title" style={{fontSize: '14px', textAlign: 'left'}}>Total energy used</h3>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="80%"
              startAngle={90}
              endAngle={-270}
              cornerRadius={14}   // curve edges
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="center-label">
          <div className="unit">Total</div>
          <div className="total">{total.toFixed(0)}</div>
          <div className="unit">kWh</div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        {data.map((item, idx) => (
          <div key={idx} className="legend-item">
            <span
              className="dot"
              style={{ backgroundColor: item.color }}
            ></span>
            <span className="legend-text">
              {item.name}, {item.value} kWh
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TotalEnergyUsed;