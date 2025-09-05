import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#5C12A7", "#FCCC43"]; // Gen1 (purple), Gen2 (orange)

const runHoursData = [
  { name: "Gen1", value: 12 },
  { name: "Gen2", value: 8 },
];

const fuelUsedData = [
  { name: "Gen1", value: 20 },
  { name: "Gen2", value: 15 },
];

const GeneratorStatus2 = () => {
  const totalRunHours = runHoursData.reduce((acc, d) => acc + d.value, 0);
  const totalFuelUsed = fuelUsedData.reduce((acc, d) => acc + d.value, 0);

  return (
    <div className="card">
      <h3 style={{fontSize: '14px', textAlign: 'left'}}>Generator Status</h3>
      <div className="card-body grid-2">
        {/* Run Hours Donut */}
        <div className="status-item">
          {/* <h4>Run Hours</h4> */}
          <div style={{ width: "100%", height: 180, position: "relative" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={runHoursData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  // cornerRadius={8}
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

            {/* Right-side labels */}
            <div
              style={{
                position: "absolute",
                right: "50px",
                top: "30%",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {runHoursData.map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: COLORS[i],
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>
                    {d.value}h
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom cumulative label */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {totalRunHours}h 59m 06s
            </div>
          </div>
        </div>

        {/* Fuel Used Donut */}
        <div className="status-item">
          {/* <h4>Fuel Used</h4> */}
          <div style={{ width: "100%", height: 180, position: "relative" }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={fuelUsedData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                  // cornerRadius={8}
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

            {/* Right-side labels */}
            <div
              style={{
                position: "absolute",
                right: "50px",
                top: "30%",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              {fuelUsedData.map((d, i) => (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: COLORS[i],
                    }}
                  />
                  <span style={{ fontSize: "14px" }}>
                    {d.value}L
                  </span>
                </div>
              ))}
            </div>

            {/* Bottom cumulative label */}
            <div
              style={{
                position: "absolute",
                bottom: "-20px",
                width: "100%",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              {totalFuelUsed}Litres
            </div>
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
    </div>
  );
};

export default GeneratorStatus2;