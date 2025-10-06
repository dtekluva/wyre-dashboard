// SolarOverviewPage.jsx
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
  const percentage = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
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
   FlowDiagram (Z-shaped with stretched-S bends)
   --------------------------- */
const FlowDiagram = ({ production, battery, grid, usage, capacity }) => {
  const nodes = {
    production: { x: 300, y: 160, r: 52, label: "Production", color: "#f59e0b", bg: "#fde68a", value: `${production} kW` },
    capacity:   { x: 140, y: 50,  r: 36, label: "Capacity",   color: "#6d28d9", bg: "#f3e8ff", value: `${capacity} kWp` },
    battery:    { x: 140, y: 270, r: 36, label: "Battery",    color: "#16a34a", bg: "#dcfce7", value: `${battery}%` },
    grid:       { x: 460, y: 50,  r: 36, label: "Grid",       color: "#2563eb", bg: "#dbeafe", value: `${grid} kW` },
    usage:      { x: 460, y: 270, r: 36, label: "Usage",      color: "#dc2626", bg: "#fee2e2", value: `${usage} kW` },
  };

  // Spaced offsets so lines don't meet
  const connectors = [
    { from: "capacity", to: "production", color: nodes.capacity.color, side: "left",  offset: -28 },
    { from: "battery",  to: "production", color: nodes.battery.color,  side: "left",  offset:  12 },
    { from: "grid",     to: "production", color: nodes.grid.color,     side: "right", offset: -18 },
    { from: "usage",    to: "production", color: nodes.usage.color,    side: "right", offset:  22 },
  ];

  return (
    <svg width="100%" height="320" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet" className="flow-svg">
      {/* nodes */}
      {Object.entries(nodes).map(([key, n]) => (
        <g key={key} className="node-group">
          <circle cx={n.x} cy={n.y} r={n.r} fill={n.bg} stroke={n.color} strokeWidth="2" />
          <text x={n.x} y={n.y - 8} textAnchor="middle" fontSize="11" fill={n.color}>{n.label}</text>
          <text x={n.x} y={n.y + 14} textAnchor="middle" fontSize="13" fontWeight="700" fill={n.color}>{n.value}</text>
        </g>
      ))}

      {/* connectors: Z-layout but smoothed into stretched-S curves */}
      {/* {connectors.map(({ from, to, color, side, offset }, idx) => {
        const start = nodes[from];
        const end = nodes[to];

        const sx = start.x + (start.x < end.x ? start.r : -start.r);
        const sy = start.y;

        const prodAttachX = end.x + (side === "left" ? -end.r : end.r);
        const prodAttachY = end.y + offset;

        // Horizontal step from source
        const midX1 = sx + (prodAttachX - sx) * 0.67;
        const midY1 = sy;

        // Diagonal middle leg
        const midX2 = sx + (prodAttachX - sx) * 0.25;
        const midY2 = prodAttachY;

        const pathD = [
          `M ${sx},${sy}`,
          `Q ${(sx + midX1) / 2},${sy} ${midX1},${midY1}`, // rounded first bend
          `L ${midX2},${midY2}`,
          `Q ${(midX2 + prodAttachX) / 2},${prodAttachY} ${prodAttachX},${prodAttachY}` // rounded second bend
        ].join(" ");

        return (
          <motion.path
            key={idx}
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2 + idx * 0.1, ease: "easeInOut" }}
          />
        );
      })} */}
      {connectors.map(({ from, to, color, side, offset }, idx) => {
        const start = nodes[from];
        const end = nodes[to];

        // Start point
        const sx = start.x + (start.x < end.x ? start.r : -start.r);
        const sy = start.y;

        // End point
        const ex = end.x + (side === "left" ? -end.r : end.r);
        const ey = end.y + offset;

        // Middle control points for stretched Z-shape
        const midX1 = sx + (ex - sx) * 0.25;
        const midY1 = sy;

        const midX2 = sx + (ex - sx) * 0.75;
        const midY2 = ey;

        const pathD = [
          `M ${sx},${sy}`,
          `Q ${(sx + midX1) / 2},${sy} ${midX1},${midY1}`,
          `L ${midX2},${midY2}`,
          `Q ${(midX2 + ex) / 2},${ey} ${ex},${ey}`
        ].join(" ");

        return (
          <g key={idx}>
            {/* Base line (always visible) */}
            <path
              d={pathD}
              fill="none"
              stroke="#ccc"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Glowing pulses */}
            {[0, 0.6, 1.2].map((delay, pulseIdx) => (
              <motion.path
                key={pulseIdx}
                d={pathD}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="10 300"
                initial={{ strokeDashoffset: 300 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: delay
                }}
                style={{
                  filter: "drop-shadow(0px 0px 6px rgba(0, 191, 255, 0.8))"
                }}
              />
            ))}
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
        <Col span={11}>
          <Card className="left-card">
            <div className="left-card-header">
              <div className="header-left">
                <EnvironmentOutlined className="icon-small" />
                <div className="header-text">
                  <div className="location">Lekki — cloudy 23°C</div>
                  <div className="sun-info"><CloudOutlined /> Sunrise 06:38 • Sunset 18:53 (UTC+01)</div>
                </div>
              </div>
              <div className="header-right">
                <SettingOutlined className="icon-small" />
                <InfoCircleOutlined className="icon-small" />
              </div>
            </div>

            <div className="left-card-body">
              <div className="gauge-area">
                <CircleGauge value={productionPower} max={capacity} size={220} segments={48} />
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

        <Col span={13}>
          <Card className="right-card">
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
              <h3>Mix, Circuit, and Balance</h3>
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
        <Col span={16}>
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

        <Col span={8}>
          <Card>
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
    </div>
  );
};

export default SolarOverviewPage;