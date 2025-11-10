import React, { useEffect, useState } from "react";
import { Card, Row, Col, Progress, Select, Tabs, Table, DatePicker } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  EnvironmentOutlined,
  CloudOutlined,
  SettingOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";  
import productionImg from "../assets/icons/production.png";
import capacityImg from "../assets/icons/capacity.png";
import batteryImg from "../assets/icons/battery.png";
import gridImg from "../assets/icons/grid.png";
import usageImg from "../assets/icons/usage.png";
import { motion } from "framer-motion/dist/framer-motion"; // Node12-safe import
import BreadCrumb from "../components/BreadCrumb";
import { fetchBatterySystemData, fetchComponentsTableData, fetchConsumptionsData, fetchInverterGridsData, fetchPvProductionData, fetchWeatherReadingsData } from "../redux/actions/solar/solar.action";
import { connect } from "react-redux";
// import "./SolarOverviewPage.css";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "/", name: "Solar Overview", id: 2 },
];

const { Option } = Select;

/* ---------------------------
   CircleGauge (Segmented SVG)
   --------------------------- */
const CircleGauge = ({ value, max, size = 200, segments = 48 }) => {
  // const percentage = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  const percentage = 13;
  const cx = size / 2;
  const cy = size / 2;
  const inner = size * 0.34; // inner radius for ticks start
  const outer = size * 0.45; // outer radius for ticks end
  const activeSegments = Math.round((percentage / 100) * segments);

  return (
    <svg
      className="circle-gauge"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-label={`Gauge ${percentage}%`}
    >
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#7B61FF" stopOpacity="1" />
          <stop offset="100%" stopColor="#6C4CFF" stopOpacity="1" />
        </linearGradient>

        <filter id="gaugeShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#7B61FF" floodOpacity="0.07" />
        </filter>
      </defs>

      <g transform={`translate(${cx},${cy})`} filter="url(#gaugeShadow)">
        {Array.from({ length: segments }).map((_, i) => {
          const angle = (i / segments) * Math.PI * 2 - Math.PI / 2; // start top
          const x1 = inner * Math.cos(angle);
          const y1 = inner * Math.sin(angle);
          const x2 = outer * Math.cos(angle);
          const y2 = outer * Math.sin(angle);
          const active = i < activeSegments;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={active ? "url(#gaugeGrad)" : "#E6E9EE"}
              strokeWidth={active ? 6 : 4}
              strokeLinecap="round"
              opacity={active ? 1 : 0.6}
            />
          );
        })}

        <circle r={inner - 12} fill="#fff" />
        <text y={-6} textAnchor="middle" fontSize="22" fontWeight="700" fill="#111827">
          {percentage}%
        </text>
        <text y={16} textAnchor="middle" fontSize="12" fill="#6B7280">
          Power
        </text>
      </g>
    </svg>
  );
};

const EnergySummary = ({ tableContentsData }) => {
  if (!tableContentsData) return null;

  const tabs = ["generation", "battery", "load", "grid"];
  const tabLabels = {
    generation: "Generation",
    battery: "Battery",
    load: "Load",
    grid: "Grid",
  };

  const formatValue = (val) => (val ? Number(val).toLocaleString() : "0");

  return (
    <div className="energy-summary-container" style={{ background: "#fff" }}>
      <Tabs defaultActiveKey="generation" tabBarGutter={50}>
        {tabs.map((key) => (
          <Tabs.TabPane tab={tabLabels[key]} key={key}>
            <div className="energy-tab-content" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              {["total", "today", "monthly"].map((period) => {
                const item = tableContentsData[key]?.[period] || {};
                return (
                  <div
                    key={period}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                      {period === "total"
                        ? "Total yield"
                        : period === "today"
                        ? "Today yield"
                        : "Monthly yield"}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#999" }}>
                        {formatValue(item.kwh)} <span style={{ color: "#999" }}>kWh</span>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#999" }}>
                        {formatValue(item.cost)} <span style={{ color: "#00b140" }}>NGN</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

/* ---------------------------
   FlowDiagram (Final curved Z-shape + glowing pulses)
   --------------------------- */
const FlowDiagram = ({ inverterData }) => {
  const { pv, battery, grid, load } = inverterData || {};

  const production = pv?.kw ?? 0;
  const capacity = pv?.installed_capacity_kwp ?? 0;
  const capacityPercentage = pv?.percentage ?? 0;

  const nodes = {
    production: {
      x: 300,
      y: 160,
      r: 62,
      color: "#f59e0b",
      bg: "#fde68a",
      icon: productionImg,
      label: "Production",
      value: `${production.toFixed(2)} kW`,
    },
    capacity: {
      x: -40,
      y: 50,
      r: 38,
      color: "#6d28d9",
      bg: "#f3e8ff",
      icon: capacityImg,
      label: "Capacity",
      value: `${capacity} kWp`,
      percentage: capacityPercentage,
      direction: pv?.direction,
    },
    battery: {
      x: -40,
      y: 270,
      r: 38,
      color: "#16a34a",
      bg: "#dcfce7",
      icon: batteryImg,
      label: "Battery",
      value: `${(battery?.kw ?? 0).toFixed(2)} kW`,
      percentage: battery?.percentage ?? 0,
      direction: battery?.direction,
    },
    grid: {
      x: 660,
      y: 50,
      r: 38,
      color: "#2563eb",
      bg: "#dbeafe",
      icon: gridImg,
      label: "Grid",
      value: `${(grid?.kw ?? 0).toFixed(2)} kW`,
      direction: grid?.direction,
      status: grid?.status,
    },
    usage: {
      x: 660,
      y: 270,
      r: 38,
      color: "#dc2626",
      bg: "#fee2e2",
      icon: usageImg,
      label: "Usage",
      value: `${(load?.kw ?? 0).toFixed(2)} kW`,
      direction: load?.direction,
    },
  };

  const connectors = [
    { from: "capacity", to: "production", color: nodes.capacity.color, side: "left", offset: -28 },
    { from: "battery", to: "production", color: nodes.battery.color, side: "left", offset: 12 },
    { from: "grid", to: "production", color: nodes.grid.color, side: "right", offset: -18 },
    { from: "usage", to: "production", color: nodes.usage.color, side: "right", offset: 22 },
  ];

  return (
    <div style={{ textAlign: "center" }}>
      <svg width="100%" height="320" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
        {connectors.map(({ from, to, color, side, offset }, idx) => {
          const start = nodes[from];
          const end = nodes[to];
          const direction = start?.direction;
          const isOutgoing = direction === "OUT";
          const isIdle = direction === "IDLE";
          const isGridOff = start?.status === "OFF";

          const [sx, sy, ex, ey] = isOutgoing
            ? [end.x + (side === "left" ? -end.r : end.r), end.y + offset, start.x + (start.x < end.x ? start.r : -start.r), start.y]
            : [start.x + (start.x < end.x ? start.r : -start.r), start.y, end.x + (side === "left" ? -end.r : end.r), end.y + offset];

          const midX1 = sx + (ex - sx) * 0.25;
          const midX2 = sx + (ex - sx) * 0.75;

          const pathD = `
            M ${sx},${sy}
            Q ${(sx + midX1) / 2},${sy} ${midX1},${sy}
            L ${midX2},${ey}
            Q ${(midX2 + ex) / 2},${ey} ${ex},${ey}
          `;

          return (
            <g key={idx}>
              <path d={pathD} fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
              {!isIdle && !isGridOff &&
                [0, 0.6, 1.2].map((delay, pulseIdx) => (
                  <motion.path
                    key={pulseIdx}
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="10 300"
                    initial={{ strokeDashoffset: isOutgoing ? 300 : -300 }}
                    animate={{ strokeDashoffset: 0 }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "linear",
                      delay,
                    }}
                    style={{ filter: `drop-shadow(0px 0px 6px ${color}80)` }}
                  />
                ))}
            </g>
          );
        })}

        {Object.entries(nodes).map(([key, n]) => {
          const iconSize = n.r * 0.9;
          let labelOffsetX = 0;
          let textAnchor = "middle";

          if (key === "capacity" || key === "battery") {
            labelOffsetX = -n.r - 95;
            textAnchor = "start";
          } else if (key === "grid" || key === "usage") {
            labelOffsetX = n.r + 95;
            textAnchor = "end";
          }

          return (
            <g key={key}>
              <circle cx={n.x} cy={n.y} r={n.r} fill={n.bg} stroke={n.color} strokeWidth="2" />
              {["capacity", "battery"].includes(key) && n.percentage !== undefined && (
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 5}
                  fill="none"
                  stroke={n.color}
                  strokeWidth="4"
                  strokeDasharray={`${(2 * Math.PI * (n.r + 5) * n.percentage) / 100} ${2 * Math.PI * (n.r + 5)}`}
                  strokeLinecap="round"
                  opacity="0.6"
                />
              )}
              {key === "grid" && (
                <circle
                  cx={n.x + n.r - 6}
                  cy={n.y - n.r + 6}
                  r="6"
                  fill={n.status === "ON" ? "#22c55e" : "#ef4444"}
                  stroke="#fff"
                  strokeWidth="1.5"
                  style={{
                    filter:
                      n.status === "ON"
                        ? "drop-shadow(0px 0px 6px #22c55e)"
                        : "drop-shadow(0px 0px 6px #ef4444)",
                  }}
                />
              )}
              <motion.image
                href={n.icon}
                x={n.x - iconSize / 2}
                y={n.y - iconSize / 2}
                width={iconSize}
                height={iconSize}
                preserveAspectRatio="xMidYMid meet"
              />
              {key === "production" ? (
                <>
                  <text x={n.x} y={n.y - n.r - 24} textAnchor="middle" fontSize="13" fill="#111827" fontWeight="600">
                    {n.label}
                  </text>
                  <text x={n.x} y={n.y - n.r - 9} textAnchor="middle" fontSize="12" fill="#6B7280">
                    {n.value}
                  </text>
                </>
              ) : (
                <>
                  <text x={n.x + labelOffsetX} y={n.y - 34} textAnchor={textAnchor} fontSize="13" fill="#111827" fontWeight="600">
                    {n.label}
                  </text>
                  <text x={n.x + labelOffsetX} y={n.y - 14} textAnchor={textAnchor} fontSize="12" fill="#6B7280">
                    {n.value}
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      {/* === LEGEND === */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "8px", gap: "16px", fontSize: "12px", color: "#4b5563" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 10, height: 10, background: "#22c55e", borderRadius: "50%" }}></div> Grid: ON
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 10, height: 10, background: "#ef4444", borderRadius: "50%" }}></div> Grid: OFF
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: 12, height: 2, background: "#ccc" }}></div> Idle / No flow
        </div>
      </div>
    </div>
  );
};


/* ---------------------------
   Main SolarOverviewPage
   --------------------------- */
const SolarOverviewPage = ({ solar, fetchWeatherReadingsData, fetchComponentsTableData, fetchInverterGridsData, fetchConsumptionsData, fetchPvProductionData, fetchBatterySystemData }) => {
  const [period, setPeriod] = useState("Select period");
  const [parameters, setParameters] = useState("Parameters");
  const [weatherContentsData, setWeatherContentsData] = useState(null);
  const [tableContentsData, setTableContentsData] = useState(null);
  const [inverterContentsData, setInverterContentsData] = useState({});
  const [consumptionChartContents, setConsumptionChartContents] = useState(null);
  const [pvProductionChartContents, setPvProductionChartContents] = useState(null);
  const [batteryChartContents, setBatteryChartContents] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  console.log('period === ', period);
  console.log('solar === ', solar);
  console.log('consumptionChartContents === ', consumptionChartContents);
  console.log('weatherContentsData === ', weatherContentsData);
  console.log('pvProductionChartContents === ', pvProductionChartContents);
  console.log('batteryChartContents === ', batteryChartContents);
  
useEffect(() => {
    // if (!selectedDate) return;
    fetchWeatherReadingsData()
    fetchComponentsTableData()
    fetchInverterGridsData()
    fetchConsumptionsData()
    fetchPvProductionData()
    fetchBatterySystemData()
  }, []);

  useEffect(() => {
    if (solar) {  
      setWeatherContentsData(solar?.weatherReadingsData);
      setTableContentsData(solar?.componentsTableData)
      setInverterContentsData(solar?.inverterGridsData);
      setConsumptionChartContents(solar?.consumptionChartData);
      setPvProductionChartContents(solar?.pvProductionChartData);
      setBatteryChartContents(solar?.batteryChartData);
    }
  }, [solar]);

  // sample data (swap with your real state/API)
  const productionPower = 29.38;
  const battery = 83.8;
  const grid = 2.12;
  const usage = 13.77;
  const capacity = 49.2;

  // const chartData = [
  //   { time: "00:00", production: 100, grid: 50, load: 70 },
  //   { time: "03:00", production: 200, grid: 80, load: 150 },
  //   { time: "06:00", production: 400, grid: 100, load: 220 },
  //   { time: "09:00", production: 600, grid: 120, load: 500 },
  //   { time: "12:00", production: 900, grid: 160, load: 700 },
  //   { time: "15:00", production: 700, grid: 140, load: 600 },
  //   { time: "18:00", production: 400, grid: 100, load: 300 },
  //   { time: "21:00", production: 200, grid: 80, load: 150 },
  // ];
  // Map API data for chart
  const consumptionChartData = consumptionChartContents?.hours?.map((h) => ({
    time: h.hour_label,
    production: h.pv_kw ?? 0,
    grid: h.grid_kw ?? 0,
    load: h.load_kw ?? 0,
  })) || [];

  const PvChartData = pvProductionChartContents?.hours?.map((h) => ({
    time: h.hour_label,
    pv_kw: h.pv_kw ?? 0,
  })) || [];
  
  const batteryChartData = batteryChartContents?.hours?.map((h) => ({
    time: h.hour_label,
    backup_load: h.backup_load_kwh ?? 0,
    battery_charge: h.battery_charge_kwh ?? 0,
    battery_discharge: h.battery_discharge_kwh ?? 0,
  })) || [];

  const yieldCurve = [
    { time: "00:00", yield: 0 },
    { time: "03:00", yield: 50 },
    { time: "06:00", yield: 120 },
    { time: "09:00", yield: 200 },
    { time: "12:00", yield: 400 },
    { time: "15:00", yield: 600 },
    { time: "18:00", yield: 750 },
    { time: "21:00", yield: 800 },
  ];

  const batteryData = [
    { time: "00:00", charge: 20, discharge: 10 },
    { time: "03:00", charge: 25, discharge: 15 },
    { time: "06:00", charge: 40, discharge: 20 },
    { time: "09:00", charge: 60, discharge: 30 },
    { time: "12:00", charge: 80, discharge: 40 },
    { time: "15:00", charge: 90, discharge: 50 },
    { time: "18:00", charge: 85, discharge: 60 },
    { time: "21:00", charge: 70, discharge: 40 },
  ];

  return (
    <div className="solar-overview">
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {/* Top row: Left gauge card (span=11) + Right flow card (span=13) */}
      <Row gutter={16}>
        <Col span={13}>
          <Card className="left-card">
            <div className="left-card-header">
              <div className="header-left">
                <div className="header-text">
                  <div className="location"><EnvironmentOutlined className="icon-small" />Lagos — Clouds (overcast clouds) 25.2°C</div>
                  <div className="sun-info"><CloudOutlined /> Sunshine 06:33 - 18:25 <p>(UTC+01)</p></div>
                </div>
              </div>
            </div>

            <div className="left-card-body">
              <div className="gauge-area">
                <CircleGauge value={productionPower} max={capacity} size={175} segments={30} />
              </div>

              <div className="gauge-stats">
                <div className="stat-row">
                  <span className="dot dot-active" />
                  <div>
                    <div className="stat-label">PV Production</div>
                    <div className="stat-value">{productionPower} kW</div>
                  </div>
                </div>

                <div className="stat-row">
                  <span className="dot dot-muted" />
                  <div>
                    <div className="stat-label">Installed Capacity</div>
                    <div className="stat-value">{capacity} kWp</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={11}>
          <Card className="summary-card">
            <EnergySummary tableContentsData={tableContentsData} />
          </Card>
        </Col>
      </Row>     
      <Row gutter={16} className="svg-row">
        <Col span={24}>
          <Card className="">
            <FlowDiagram inverterData={inverterContentsData} />
          </Card>
        </Col>
      </Row>
      {/* Charts section — unchanged structure */}
      <Row gutter={16} className="charts-row">
        <Col span={24}>
          <Card className="custom-card">
              <h3 className="card-label">Consumption</h3>
            <div className="chart-header">
              <DatePicker placeholder="Select period" style={{ height: 40 }} />
              <Select value={parameters} onChange={setParameters} style={{ width: 150 }}>
                <Option value="Parameters">All parameters</Option>
                <Option value="pv">Production</Option>
                <Option value="grid">Grid</Option>
                <Option value="load">Load</Option>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={consumptionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />

                {(!parameters || parameters === "Parameters" || parameters === "pv") && (
                  <Area
                    type="monotone"
                    dataKey="production"
                    name="Production (kW)"
                    stroke="#f59e0b"
                    fill="#fde68a"
                  />
                )}

                {(!parameters || parameters === "Parameters" || parameters === "grid") && (
                  <Area
                    type="monotone"
                    dataKey="grid"
                    name="Grid (kW)"
                    stroke="#7B61FF"
                    fill="#c4b5fd"
                  />
                )}

                {(!parameters || parameters === "Parameters" || parameters === "load") && (
                  <Area
                    type="monotone"
                    dataKey="load"
                    name="Load (kW)"
                    stroke="#3b82f6"
                    fill="#bfdbfe"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="charts-row">
        <Col span={24}>
          <Card className="custom-card">
            <h3 className="card-label">PV Production</h3>
            <div className="chart-header">
              <DatePicker placeholder="Select period" style={{height:40}}/>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={PvChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="pv_kw"
                  name="Production (kW)"
                  stroke="#f59e0b"
                  fill="#fde68a"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="yield-row">
        <Col span={24}>
          <Card className="custom-card">
            <h3 className="card-label">Battery</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={batteryChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="backup_load" stroke="#3b82f6" />
                <Area type="monotone" dataKey="battery_charge" stroke="#22c55e" />
                <Area type="monotone" dataKey="battery_discharge" stroke="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapDispatchToProps = {
  fetchWeatherReadingsData,
  fetchComponentsTableData,
  fetchInverterGridsData,
  fetchConsumptionsData,
  fetchPvProductionData,
  fetchBatterySystemData
};

const mapStateToProps = (state) => ({
  solar: state.solarReducer,
});

export default connect(mapStateToProps, mapDispatchToProps)(SolarOverviewPage);