import { Spin } from "antd";
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const GeneratorStatus2 = ({ genStatusChartData, loader }) => {
  const { total_fuel_liters, total_runtime, total_runtime_hours, generators=[] } = genStatusChartData && genStatusChartData.data || {}
  const COLORS = ["#5C12A7", "#FCCC43","#52AC0B"];
  const runHoursData = generators.map((g) => ({
    name: g.name,
    value: g.runtime_hours,
    formatted: g.runtime_formatted,
  }));
  const fuelUsedData = generators.map((g) => ({
    name: g.name,
    value: g.fuel_liters,
    formatted: `${(g.fuel_liters)?.toLocaleString()} Litres`,
  }));

  return (
    <div className="card">
      <Spin spinning={loader}>
      <>
        <h3 className="card-title">
          Generator Status
        </h3>
        <div className="card-body grid-2">
          {/* Run Hours Donut */}
          <div className="status-item">
            <div className="donut-wrapper">
              {/* Donut Chart */}
              <div className="donut-chart">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={runHoursData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {runHoursData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="center-label">
                  <div className="label">Run</div>
                  <div className="label">Hours</div>
                </div>
              </div>

              {/* Right-side labels */}
              <div className="donut-labels">
                {runHoursData.map((d, i) => (
                  <div key={i} className="label-row">
                    <span
                      className="dot"
                      style={{ background: COLORS[i] }}
                    />
                    <span className="label-text">{d.formatted}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom cumulative label */}
            <div className="donut-total">
              {total_runtime}
            </div>
          </div>

          {/* Fuel Used Donut */}
          <div className="status-item">
            <div className="donut-wrapper">
              {/* Donut Chart */}
              <div className="donut-chart">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={fuelUsedData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={50}
                      outerRadius={70}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                    >
                      {fuelUsedData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                {/* Center label */}
                <div className="center-label">
                  <div className="label">Fuel</div>
                  <div className="label">Used</div>
                </div>
              </div>

              {/* Right-side labels */}
              <div className="donut-labels">
                {fuelUsedData.map((d, i) => (
                  <div key={i} className="label-row">
                    <span
                      className="dot"
                      style={{ background: COLORS[i] }}
                    />
                    <span className="label-text">{d.formatted}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom cumulative label */}
            <div className="donut-total">
              {(total_fuel_liters)?.toLocaleString()} Litres
            </div>
          </div>
        </div>

        {/* Legends for Gen1 & Gen2 */}
        <div
          style={{
            marginTop: "12px",
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            color: "#333"
          }}
        >
          {runHoursData.map((d, i) => (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: COLORS[i],
                }}
              />
              <span style={{ fontSize: "13px" }}>{d.name}</span>
            </div>
          ))}
        </div>
      </>
    </Spin>
    </div>
  );
};

export default GeneratorStatus2;