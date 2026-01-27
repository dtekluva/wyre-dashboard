import { Spin } from "antd";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const TotalEnergyUsed = ({ genTotalEnergyUsedData, loader }) => {
  const { status, total_energy, generators } = genTotalEnergyUsedData || {};

  const colorData = ["#5C12A7", "#FCCC43"];
  const generatorsWithColor = generators?.map((generator, index) => ({
    ...generator,
    color: colorData[index] || "#52AC0B"
  }));

  return (
    <div className="total-energy-card">
      <Spin spinning={loader}>
        <h3 className="card-title total-energy-title">Total energy used</h3>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={generatorsWithColor}
                dataKey="energy"
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="80%"
                startAngle={90}
                endAngle={-270}
                cornerRadius={14}   // curve edges
              >
                {generatorsWithColor?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="center-label">
            <div className="unit">Total</div>
            <div className="total">{total_energy?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            <div className="unit">kWh</div>
          </div>
        </div>

        {/* Legend */}
        <div className="legend">
          {generatorsWithColor?.map((item, idx) => (
            <div key={idx} className="legend-item">
              <span
                className="dot"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="legend-text">
                {item.name}, {item.energy} kWh
              </span>
            </div>
          ))}
        </div>
      </Spin>
    </div>
  );
};

export default TotalEnergyUsed;