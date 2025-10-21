import React, { useState } from "react";
import { Card, Row, Col, Progress, Select, Table } from "antd";
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
// === Import your exported PNG icons ===
import productionImg from "../assets/icons/production.png";
import capacityImg from "../assets/icons/capacity.png";
import batteryImg from "../assets/icons/battery.png";
import gridImg from "../assets/icons/grid.png";
import usageImg from "../assets/icons/usage.png";
import { motion } from "framer-motion/dist/framer-motion"; // Node12-safe import
import BreadCrumb from "../components/BreadCrumb";
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

/* ---------------------------
   FlowDiagram (Final curved Z-shape + glowing pulses)
   --------------------------- */
const FlowDiagram = ({ production, battery, grid, usage, capacity }) => {
  const nodes = {
    production: {
      x: 300,
      y: 160,
      r: 62,
      color: "#f59e0b",
      bg: "#fde68a",
      icon: productionImg,
      label: "Production",
      value: `${production} kW`,
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
      percentage: 62.5,
    },
    battery: {
      x: -40,
      y: 270,
      r: 38,
      color: "#16a34a",
      bg: "#dcfce7",
      icon: batteryImg,
      label: "Battery",
      value: `${battery} kW`,
      percentage: 83.8,
    },
    grid: {
      x: 660,
      y: 50,
      r: 38,
      color: "#2563eb",
      bg: "#dbeafe",
      icon: gridImg,
      label: "Grid",
      value: `${grid} kW`,
    },
    usage: {
      x: 660,
      y: 270,
      r: 38,
      color: "#dc2626",
      bg: "#fee2e2",
      icon: usageImg,
      label: "Usage",
      value: `${usage} kW`,
    },
  };

  const connectors = [
    { from: "capacity", to: "production", color: nodes.capacity.color, side: "left", offset: -22 },
    { from: "battery", to: "production", color: nodes.battery.color, side: "left", offset: 18 },
    { from: "grid", to: "production", color: nodes.grid.color, side: "right", offset: -22 },
    { from: "usage", to: "production", color: nodes.usage.color, side: "right", offset: 22 },
  ];

  return (
    <svg
      width="100%"
      height="320"
      viewBox="0 0 600 320"
      preserveAspectRatio="xMidYMid meet"
      className="flow-svg"
    >
      {/* === CONNECTORS === */}
      {connectors.map(({ from, to, color, side, offset }, idx) => {
        const start = nodes[from];
        const end = nodes[to];

        const sx = start.x + (start.x < end.x ? start.r : -start.r);
        const sy = start.y;
        const ex = end.x + (side === "left" ? -end.r : end.r);
        const ey = end.y + offset;

        // smooth S-like stretched connector
        const control1X = sx + (ex - sx) * 0.35;
        const control1Y = sy + (ey - sy) * 0.15;
        const control2X = sx + (ex - sx) * 0.65;
        const control2Y = sy + (ey - sy) * 0.85;
        const pathD = `M ${sx},${sy} C ${control1X},${control1Y} ${control2X},${control2Y} ${ex},${ey}`;

        return (
          <g key={idx}>
            {/* Base connector line */}
            <path
              d={pathD}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.25"
            />

            {/* Multiple glowing pulses */}
            {[0, 0.7, 1.4].map((delay, pulseIdx) => (
              <motion.path
                key={pulseIdx}
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="20 300"
                initial={{ strokeDashoffset: 300 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay,
                }}
                style={{
                  filter: `drop-shadow(0px 0px 6px ${color}80)`,
                }}
              />
            ))}
          </g>
        );
      })}

      {/* === CIRCLES (NODES) WITH LABELS & IMAGES === */}
      {Object.entries(nodes).map(([key, n]) => {
        const iconSize = n.r * 0.9;

        // Label positioning logic
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
          <g key={key} className="node-group">
            {/* Main circle */}
            <circle cx={n.x} cy={n.y} r={n.r} fill={n.bg} stroke={n.color} strokeWidth="2" />

            {/* Progress arc for Capacity & Battery */}
            {["capacity", "battery"].includes(key) && n.percentage !== undefined && (
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r + 5}
                fill="none"
                stroke={n.color}
                strokeWidth="4"
                strokeDasharray={`${(2 * Math.PI * (n.r + 5) * n.percentage) / 100} ${
                  2 * Math.PI * (n.r + 5)
                }`}
                strokeDashoffset="0"
                strokeLinecap="round"
                opacity="0.6"
              />
            )}

            {/* PNG Image (icon) */}
            <motion.image
              href={n.icon}
              x={n.x - iconSize / 2}
              y={n.y - iconSize / 2}
              width={iconSize}
              height={iconSize}
              preserveAspectRatio="xMidYMid meet"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              style={{ pointerEvents: "none" }}
            />

            {/* Labels and Values */}
            {key === "production" ? (
              <>
                <text
                  x={n.x}
                  y={n.y - n.r - 22}
                  textAnchor="middle"
                  fontSize="13"
                  fill="#111827"
                  fontWeight="600"
                >
                  {n.label}
                </text>
                <text
                  x={n.x}
                  y={n.y - n.r - 7}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#6B7280"
                >
                  {n.value}
                </text>
              </>
            ) : (
              <>
                <text
                  x={n.x + labelOffsetX}
                  y={n.y - 34}
                  textAnchor={textAnchor}
                  fontSize="13"
                  fill="#111827"
                  fontWeight="600"
                >
                  {n.label}
                </text>
                <text
                  x={n.x + labelOffsetX}
                  y={n.y - 14}
                  textAnchor={textAnchor}
                  fontSize="12"
                  fill="#6B7280"
                >
                  {n.value}
                </text>
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
};


/* ---------------------------
   Main SolarOverviewPage
   --------------------------- */
const SolarOverviewPage = () => {
  const [period, setPeriod] = useState("today");

  // sample data (swap with your real state/API)
  const productionPower = 29.38;
  const battery = 83.8;
  const grid = 2.12;
  const usage = 13.77;
  const capacity = 49.2;

  const yieldData = [
    { key: "1", type: "Total yield", value: "28.4 kWh", price: "789,699 NGN" },
    { key: "2", type: "Today yield", value: "28.4 kWh", price: "5,777 NGN" },
    { key: "3", type: "Monthly yield", value: "28.4 kWh", price: "398,756 NGN" },
  ];

  const chartData = [
    { time: "00:00", production: 100, grid: 50, load: 70 },
    { time: "03:00", production: 200, grid: 80, load: 150 },
    { time: "06:00", production: 400, grid: 100, load: 220 },
    { time: "09:00", production: 600, grid: 120, load: 500 },
    { time: "12:00", production: 900, grid: 160, load: 700 },
    { time: "15:00", production: 700, grid: 140, load: 600 },
    { time: "18:00", production: 400, grid: 100, load: 300 },
    { time: "21:00", production: 200, grid: 80, load: 150 },
  ];

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
        <Col span={14}>
          <Card className="left-card">
            <div className="left-card-header">
              <div className="header-left">
                <div className="header-text">
                  <div className="location"><EnvironmentOutlined className="icon-small" />Lekki — cloudy 23°C</div>
                  <div className="sun-info"><CloudOutlined /> Sunshine 06:38 - 18:53 <p>(UTC+01)</p></div>
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
        <Col span={10}>
          <Card className="right-card">
            <Table
              dataSource={yieldData}
              pagination={false}
              columns={[
                { title: "Type", dataIndex: "type", key: "type" },
                { title: "Value", dataIndex: "value", key: "value" },
                { title: "Price", dataIndex: "price", key: "price" },
              ]}
            />
          </Card>
        </Col>
      </Row>     
      <Row gutter={16} className="svg-row">
        <Col span={24}>
          <Card className="">
            <FlowDiagram
              production={productionPower}
              battery={battery}
              grid={grid}
              usage={usage}
              capacity={capacity}
            />
          </Card>
        </Col>
      </Row>
      {/* Charts section — unchanged structure */}
      <Row gutter={16} className="charts-row">
        <Col span={24}>
          <Card>
            <div className="chart-header">
              <h3>Consumption</h3>
              <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
                <Option value="today">Today</Option>
                <Option value="week">This week</Option>
                <Option value="month">This month</Option>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="production" stroke="#f59e0b" fill="#fde68a" />
                <Area type="monotone" dataKey="grid" stroke="#7B61FF" fill="#c4b5fd" />
                <Area type="monotone" dataKey="load" stroke="#3b82f6" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="charts-row">
        <Col span={24}>
          <Card>
            <h3>Yield</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={yieldCurve}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="yield" stroke="#f59e0b" fill="#fde68a" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="yield-row">
        <Col span={24}>
          <Card>
            <h3>Battery Storage</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={batteryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="charge" stroke="#22c55e" />
                <Area type="monotone" dataKey="discharge" stroke="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SolarOverviewPage;