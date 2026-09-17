import { useEffect, useRef, useState } from "react";
import { Card, Row, Col, Select, Tabs, DatePicker, Spin } from "antd";
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
import productionImg from "../assets/icons/production.png";
import capacityImg from "../assets/icons/capacity.png";
import parametersImg from "../assets/icons/parameterIcon.png";
import batteryImg from "../assets/icons/battery.png";
import gridImg from "../assets/icons/grid.png";
import usageImg from "../assets/icons/usage.png";
import generatorImg from "../assets/icons/generator.svg";
import locationLogo from "../assets/icons/locationIcon.png";
import sunLogo from "../assets/icons/sunIcon.png";
import { motion } from "framer-motion"; // Node12-safe import
import BreadCrumb from "../components/BreadCrumb";
import {
  fetchBatterySystemData,
  fetchComponentsTableData,
  fetchConsumptionsData,
  fetchPvProductionData,
  fetchSolarLiveData,
  fetchWeatherReadingsData,
} from "../redux/actions/solar/solar.action";
import { connect } from "react-redux";
import dayjs from "dayjs";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "#", name: "Solar Overview", id: 2 },
];

const { Option } = Select;

  //  CircleGauge (Segmented SVG)
const CircleGauge = ({ value, max, percentage, size = 200, segments = 48 }) => {
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

const formatSummaryNumber = (val, decimals = 0) => {
  const num = Number(val);
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const formatLagosDateTimeShort = (value) => {
  if (value == null || value === "") return null;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return null;
  return parsed.format("DD MMM, HH:mm");
};

const mapLiveToFlowData = (live) => {
  if (!live) return {};
  return {
    pv: live.pv,
    battery: live.battery,
    grid: live.grid,
    load: live.load,
    generator_power: live.generator_power,
  };
};

const ChartDayStatBadge = ({ label, value, unit, subLabel, variant = "default" }) => (
  <div className={`solar-chart-stat-badge solar-chart-stat-badge--${variant}`}>
    <div className="solar-chart-stat-badge__label">{label}</div>
    <div className="solar-chart-stat-badge__value">
      {value} <span>{unit}</span>
    </div>
    {subLabel ? <div className="solar-chart-stat-badge__sub">{subLabel}</div> : null}
  </div>
);

const BatteryChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const point = payload[0]?.payload ?? {};
  const chargeEntry = payload.find((entry) => entry.dataKey === "battery_charge");
  const dischargeEntry = payload.find((entry) => entry.dataKey === "battery_discharge");

  return (
    <div className="solar-battery-chart-tooltip">
      <div className="solar-battery-chart-tooltip__time">{label}</div>
      {chargeEntry ? (
        <div className="solar-battery-chart-tooltip__row solar-battery-chart-tooltip__row--charge">
          battery_charge: {formatSummaryNumber(chargeEntry.value, 1)} kWh
        </div>
      ) : null}
      {dischargeEntry ? (
        <div className="solar-battery-chart-tooltip__row solar-battery-chart-tooltip__row--discharge">
          battery_discharge: {formatSummaryNumber(dischargeEntry.value, 1)} kWh
        </div>
      ) : null}
      {point.soc_pct != null ? (
        <div className="solar-battery-chart-tooltip__soc">
          SOC (State of Charge): {formatSummaryNumber(point.soc_pct, 1)}%
        </div>
      ) : null}
    </div>
  );
};

const BatteryFlowIcon = ({ direction = "down", color = "#7B61FF" }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
    <rect x="0.5" y="0.5" width="13" height="13" rx="2" fill={color} stroke={color} />
    <path
      d={direction === "down" ? "M7 3.5 L7 10.5 M4.5 8 L7 10.5 L9.5 8" : "M7 10.5 L7 3.5 M4.5 6 L7 3.5 L9.5 6"}
      fill="none"
      stroke="#fff"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const getBatteryFlowMetric = (item, flow) => {
  const prefix = flow === "charged" ? "charge" : "discharge";
  return {
    kwh: item?.[`${prefix}_kwh`] ?? 0,
    cost: item?.[`${prefix}_cost`] ?? 0,
  };
};

const parseBatteryReferenceDate = (value) => {
  if (value == null || value === "") return null;

  const direct = dayjs(value);
  if (direct.isValid()) return direct;

  if (typeof value === "string") {
    const trimmed = value.trim();
    const parsedFromNative = dayjs(new Date(trimmed));
    if (parsedFromNative.isValid()) return parsedFromNative;
  }

  return null;
};

const formatBatterySinceLabel = (value) => {
  if (value == null || value === "") return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (/^since\s/i.test(trimmed)) {
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    }

    const startPart = trimmed.split(/\s*[\u2010-\u2015\u2212–—-]\s*/)[0]?.trim();
    const parsed = parseBatteryReferenceDate(startPart || trimmed);
    if (parsed) {
      return `Since ${parsed.format("DD MMM YYYY")}`;
    }
  }

  const parsed = parseBatteryReferenceDate(value);
  if (parsed) {
    return `Since ${parsed.format("DD MMM YYYY")}`;
  }

  return "";
};

const resolveYieldPayload = (tableContentsData) => {
  if (!tableContentsData) return {};
  if (tableContentsData.battery) return tableContentsData;
  if (tableContentsData.data?.battery) return tableContentsData.data;
  return tableContentsData;
};

const getBatteryTotalSinceLabel = (item = {}, batteryData = {}, yieldData = {}) => {
  const candidates = [
    batteryData.since,
    batteryData.since_date,
    batteryData.total_since,
    batteryData.total_since_date,
    batteryData.tracking_start_date,
    batteryData.total_start_date,
    batteryData.start_date,
    batteryData.total_date_range,
    batteryData.date_range,
    batteryData.total?.since,
    batteryData.total?.since_date,
    batteryData.total?.start_date,
    batteryData.total?.from_date,
    batteryData.total?.date_range,
    batteryData.total?.period,
    batteryData.total?.date_label,
    item.since,
    item.since_date,
    item.start_date,
    item.from_date,
    item.date_range,
    item.period,
    item.date_label,
    yieldData.since,
    yieldData.since_date,
    yieldData.total_since,
    yieldData.total_since_date,
    yieldData.tracking_start_date,
    yieldData.battery_since,
    yieldData.battery_since_date,
    yieldData.generation?.total?.since_date,
    yieldData.generation?.total?.start_date,
    yieldData.generation?.total?.date_range,
  ];

  for (const candidate of candidates) {
    const label = formatBatterySinceLabel(candidate);
    if (label) return label;
  }

  return "";
};

const getBatteryDateRange = (periodKey, item = {}, batteryData = {}, yieldData = {}) => {
  if (periodKey === "today" || periodKey === "monthly") {
    return "";
  }

  if (periodKey === "total") {
    // No frontend fallback — label only when API provides since/date fields.
    return getBatteryTotalSinceLabel(item, batteryData, yieldData);
  }

  return "";
};

const BatteryTabContent = ({ batteryData = {}, yieldData = {} }) => {
  const periods = [
    { key: "total", label: "Total" },
    { key: "today", label: "Today" },
    { key: "monthly", label: "Current Month" },
  ];

  return (
    <div className="battery-tab-content">
      <div className="battery-tab-grid battery-tab-grid--header">
        <div />
        <div className="battery-tab-col-heading battery-tab-col-heading--charged">
          <BatteryFlowIcon direction="down" color="#7B61FF" />
          <span>CHARGED · IN</span>
        </div>
        <div className="battery-tab-col-heading battery-tab-col-heading--discharged">
          <BatteryFlowIcon direction="up" color="#58B90A" />
          <span>DISCHARGED · OUT</span>
        </div>
      </div>

      {periods.map(({ key, label }) => {
        const item = batteryData[key] || {};
        const charged = getBatteryFlowMetric(item, "charged");
        const discharged = getBatteryFlowMetric(item, "discharged");
        const dateRange = getBatteryDateRange(key, item, batteryData, yieldData);

        return (
          <div key={key} className="battery-tab-row">
            <div className="battery-tab-period">
              <div className="battery-tab-period-label">{label}</div>
              {key === "total" && dateRange ? (
                <div className="battery-tab-period-range">{dateRange}</div>
              ) : null}
            </div>

            <div className="battery-tab-metric battery-tab-metric--charged">
              <div className="battery-tab-kwh">
                {formatSummaryNumber(charged.kwh, 1)} <span>kWh</span>
              </div>
            </div>

            <div className="battery-tab-metric battery-tab-metric--discharged">
              <div className="battery-tab-kwh">
                {formatSummaryNumber(discharged.kwh, 1)} <span>kWh</span>
              </div>
            </div>
          </div>
        );
      })}

      <div className="battery-tab-legend">
        <div className="battery-tab-legend-item">
          <BatteryFlowIcon direction="down" color="#7B61FF" />
          <span>Charged = energy stored into the battery</span>
        </div>
        <div className="battery-tab-legend-item">
          <BatteryFlowIcon direction="up" color="#58B90A" />
          <span>Discharged = energy delivered from the battery</span>
        </div>
      </div>
    </div>
  );
};

const PowerDemandMetricCell = ({ kw, at, variant }) => {
  const atLabel = at ? formatLagosDateTimeShort(at) : null;
  return (
    <div className={`power-demand-cell power-demand-cell--${variant}`}>
      <div className="power-demand-kw">
        {formatSummaryNumber(kw, 3)} <span>kW</span>
      </div>
      {atLabel ? <div className="power-demand-at">{atLabel}</div> : null}
    </div>
  );
};

const PowerDemandTabContent = ({ powerDemand = {} }) => {
  const periods = [
    { key: "today", label: "Today" },
    { key: "monthly", label: "Current Month" },
    { key: "total", label: "Total" },
  ];

  return (
    <div className="power-demand-tab-content">
      <div className="power-demand-grid power-demand-grid--header">
        <div />
        <div className="power-demand-col-heading power-demand-col-heading--max">Max</div>
        <div className="power-demand-col-heading power-demand-col-heading--min">Min</div>
        <div className="power-demand-col-heading power-demand-col-heading--avg">Avg</div>
      </div>

      {periods.map(({ key, label }) => {
        const item = powerDemand[key] || {};
        return (
          <div key={key} className="power-demand-grid power-demand-row">
            <div className="power-demand-period-label">{label}</div>
            <PowerDemandMetricCell kw={item.max_kw} at={item.max_at} variant="max" />
            <PowerDemandMetricCell kw={item.min_kw} at={item.min_at} variant="min" />
            <PowerDemandMetricCell kw={item.avg_kw} variant="avg" />
          </div>
        );
      })}
    </div>
  );
};

const EnergySummary = ({ tableContentsData }) => {
  if (!tableContentsData) return null;

  const yieldData = resolveYieldPayload(tableContentsData);
  const batteryData = yieldData.battery ?? {};
  const powerDemand = yieldData.power_demand ?? {};

  const tabs = ["generation", "battery", "load", "grid", "power_demand"];
  const tabLabels = {
    generation: "Generation",
    battery: "Battery",
    load: "Load",
    grid: "Grid",
    power_demand: "Power demand",
  };

  const contentLabels = {
    generation: {
      total: "Total Yield",
      today: "Today's yield",
      monthly: "Current Month's yield",
    },
    load: {
      total: "Consumption",
      today: "Today's Energy",
      monthly: "Current Month",
    },
    grid: {
      total: "Import",
      today: "Today's Energy",
      monthly: "Current Month",
    },
  };

  const formatValue = (val) => formatSummaryNumber(val);

  return (
    <div className="energy-summary-container" style={{ background: "#fff" }}>
      <Tabs defaultActiveKey="generation" tabBarGutter={20}>
        {tabs.map((key) => (
          <Tabs.TabPane tab={tabLabels[key]} key={key}>
            {key === "battery" ? (
              <BatteryTabContent batteryData={batteryData} yieldData={yieldData} />
            ) : key === "power_demand" ? (
              <PowerDemandTabContent powerDemand={powerDemand} />
            ) : (
              <div className="energy-tab-content" style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
                {["total", "today", "monthly"].map((period) => {
                  const item = yieldData[key]?.[period] || {};
                  const label = contentLabels[key]?.[period] ?? period;
                  return (
                    <div
                      key={period}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                        {label}
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
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

/* FlowDiagram - Framer Motion v4 compatible */
const FlowDiagram = ({ inverterData }) => {
  const { pv, battery, grid, load, generator_power: generatorPower } = inverterData || {};
  const generatorStatusNorm = String(generatorPower?.status ?? "")
    .trim()
    .toUpperCase();
  const showGenerator = generatorStatusNorm === "ON";

  const batteryKw = battery?.kw ?? 0;
  const batteryDirection = String(battery?.direction ?? "").trim().toUpperCase();
  const batteryStatus =
    batteryDirection === "OUT"
      ? "Discharging"
      : batteryDirection === "IN"
        ? "Charging"
        : batteryKw > 0
          ? "Discharging"
          : batteryKw < 0
            ? "Charging"
            : "Idle";

  const batteryStatusColor =
    batteryStatus === "Discharging"
      ? "#58B90A"
      : batteryStatus === "Charging"
        ? "#D7C6F3"
        : "#9ca3af"; // gray for idle

  const production = pv?.kw ?? 0;
  const capacity = pv?.installed_capacity_kwp ?? 0;
  const capacityPercentage = pv?.percentage ?? 0;

  const generatorKw = generatorPower?.kw ?? 0;
  const generatorFlowStatus = generatorKw > 0 ? "Supplying" : "Idle";
  const generatorFlowColor = generatorKw > 0 ? "#ea580c" : "#9ca3af";

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
    ...(showGenerator
      ? {
          generator: {
            x: -40,
            y: 160,
            r: 24,
            color: "#c2410c",
            bg: "#ffedd5",
            icon: generatorImg,
            label: "Generator",
            value: `${generatorKw.toFixed(2)} kW`,
            direction: generatorPower?.direction,
            status: generatorPower?.status,
            flowStatus: generatorFlowStatus,
            statusColor: generatorFlowColor,
          },
        }
      : {}),
    battery: {
      x: -40,
      y: 270,
      r: 38,
      color: "#16a34a",
      bg: "#dcfce7",
      icon: batteryImg,
      label: "Battery",
      value: `${Math.abs(batteryKw).toFixed(2)} kW`,
      percentage: battery?.percentage ?? 0,
      direction: battery?.direction,
      status: batteryStatus,
      statusColor: batteryStatusColor,
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
    ...(showGenerator
      ? [{ from: "generator", to: "production", color: nodes.generator.color, side: "left", offset: -8 }]
      : []),
    { from: "battery", to: "production", color: nodes.battery.color, side: "left", offset: 12 },
    { from: "grid", to: "production", color: nodes.grid.color, side: "right", offset: -18 },
    { from: "usage", to: "production", color: nodes.usage.color, side: "right", offset: 22 },
  ];

  return (
    <div className="flow-diagram-wrapper" style={{ textAlign: "center" }}>
      <svg width="100%" height="320" viewBox="-200 0 1000 320" preserveAspectRatio="xMidYMid meet">
        {connectors.map(({ from, to, color, side, offset }, idx) => {
          const start = nodes[from];
          const end = nodes[to];
          const direction = start && start.direction;
          const isIdle = direction === "IDLE";
          const startStatus = String(start?.status ?? "").trim().toUpperCase();
          const isSourceOff =
            start &&
            startStatus === "OFF" &&
            (from === "grid" || from === "generator");

          // Correct direction based on your rule:
          // IN  = Production → Node
          // OUT = Node → Production

          let sx, sy, ex, ey;

          // If flow is OUT → start at node, end at Production
          if (direction === "OUT") {
            sx = start.x + (start.x < end.x ? start.r : -start.r);
            sy = start.y;
            ex = end.x + (side === "left" ? -end.r : end.r);
            ey = end.y + offset;
          }
          // If flow is IN → start at Production, end at node
          else if (direction === "IN") {
            sx = end.x + (side === "left" ? -end.r : end.r);
            sy = end.y + offset;
            ex = start.x + (start.x < end.x ? start.r : -start.r);
            ey = start.y;
          }
          // When IDLE → no animation, but still draw base connector
          else {
            sx = start.x + (start.x < end.x ? start.r : -start.r);
            sy = start.y;
            ex = end.x + (side === "left" ? -end.r : end.r);
            ey = end.y + offset;
          }

          const midX1 = sx + (ex - sx) * 0.25;
          const midX2 = sx + (ex - sx) * 0.75;

          const pathD = `
            M ${sx},${sy}
            Q ${(sx + midX1) / 2},${sy} ${midX1},${sy}
            L ${midX2},${ey}
            Q ${(midX2 + ex) / 2},${ey} ${ex},${ey}
          `;

          // strokeDash start offset (animated) — pick a large value so the dash moves visibly
          const startOffset = direction === "OUT" ? 300 : 300;

          return (
            <g key={idx}>
              {/* base muted connector */}
              <path
                d={pathD}
                fill="none"
                stroke="#DDD"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.45"
              />

              {/* animated pulses (only when not IDLE and connector's grid is not OFF) */}
              {!isIdle && !isSourceOff &&
                [0, 0.6, 1.2].map((delay, pulseIdx) => (
                  <motion.path
                    key={pulseIdx}
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="12 260"
                    // animate as keyframes (v4 friendly)
                    animate={{ strokeDashoffset: [startOffset, 0] }}
                    transition={{
                      duration: 2.2,
                      repeat: Infinity,
                      ease: "linear",
                      delay,
                    }}
                    style={{ filter: `drop-shadow(0 0 6px ${color}80)` }}
                  />
                ))
              }
            </g>
          );
        })}
        {showGenerator && nodes.generator && (
          <line
            x1={nodes.capacity.x}
            y1={nodes.capacity.y + nodes.capacity.r}
            x2={nodes.generator.x}
            y2={nodes.generator.y - nodes.generator.r}
            stroke={nodes.capacity.color}
            strokeWidth="2.5"
            strokeDasharray="7 5"
            strokeLinecap="round"
            opacity={0.72}
          />
        )}

        {Object.entries(nodes).map(([key, n]) => {
          const iconSize = n.r * 0.9;
          let labelOffsetX = 0;
          let textAnchor = "middle";

          if (key === "capacity" || key === "battery" || key === "generator") {
            const labelR = key === "generator" ? nodes.capacity.r : n.r;
            labelOffsetX = -labelR - 95;
            textAnchor = "start";
          } else if (key === "grid" || key === "usage") {
            labelOffsetX = n.r + 95;
            textAnchor = "end";
          }

          const pillOn = String(n.status ?? "").trim().toUpperCase() === "ON";

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
               )
              }
              {(key === "grid" || key === "generator") && (
                <g
                  transform={`translate(${n.x + n.r - 24}, ${n.y - n.r - 10})`}
                >
                  {/* Status background */}
                  <rect
                    x="0"
                    y="0"
                    rx="10"
                    ry="10"
                    width="40"
                    height="18"
                    fill={pillOn ? "#22c55e" : "#ef4444"}
                    stroke="#fff"
                    strokeWidth="1.5"
                    style={{
                      filter: pillOn
                        ? "drop-shadow(0 0 6px #22c55e)"
                        : "drop-shadow(0 0 6px #ef4444)",
                    }}
                  />

                  {/* Status text */}
                  <text
                    x="20"
                    y="13"
                    textAnchor="middle"
                    fontSize="10"
                    fontWeight="700"
                    fill="#ffffff"
                    style={{ pointerEvents: "none" }}
                  >
                    {pillOn ? "ON" : "OFF"}
                  </text>
                </g>
              )}

              {/* Use plain SVG <image> (stable across builds) */}
              <image
                href={n.icon}
                x={n.x - iconSize / 2}
                y={n.y - iconSize / 2}
                width={iconSize}
                height={iconSize}
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Percentage on the connector line (Capacity & Battery only) */}
              {["capacity", "battery"].includes(key) && n.percentage !== undefined && (
                <text
                  x={n.x + (key === "capacity" ? n.r + 16 : n.r + 17)}
                  y={n.y - 10}
                  textAnchor="start"
                  fontSize="13"
                  fill={n.color}
                  fontWeight="600"
                >
                  {n.percentage}%
                </text>
              )}

              {key === "production" ? (
                <>
                  <text
                    x={n.x}
                    y={n.y - n.r - 18}
                    textAnchor="middle"
                    fontSize="13"
                    fill={n.color}
                    fontWeight="600"
                  >
                    {n.value}
                  </text>
                  <text
                    x={n.x}
                    y={n.y - n.r - 32}
                    textAnchor="middle"
                    fontSize="10"
                    fill="#555"
                  >
                    {n.label}
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
                  {(key === "battery" || key === "generator") && (
                    <text
                      x={n.x + labelOffsetX}
                      y={n.y + 2}
                      textAnchor={textAnchor}
                      fontSize="11"
                      fontWeight="600"
                      fill={n.statusColor}
                    >
                      {key === "battery" ? n.status : n.flowStatus}
                    </text>
                  )}
                </>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ---------------------------
   Main SolarOverviewPage
   --------------------------- */
const SolarOverviewPage = ({
  solar,
  fetchWeatherReadingsData,
  fetchComponentsTableData,
  fetchSolarLiveData,
  fetchConsumptionsData,
  fetchPvProductionData,
  fetchBatterySystemData,
}) => {
  const [parameters, setParameters] = useState("Parameters");
  const [weatherContentsData, setWeatherContentsData] = useState(null);
  const [tableContentsData, setTableContentsData] = useState(null);
  const [consumptionChartContents, setConsumptionChartContents] = useState(null);
  const [pvProductionChartContents, setPvProductionChartContents] = useState(null);
  const [batteryChartContents, setBatteryChartContents] = useState(null);
  const livePollIntervalRef = useRef(null);
  const liveRefreshSecondsRef = useRef(15);

  const handleConsumptionDateChange = (date) => {
    if (!date) return;
    const jsDate = date.toDate();          // Moment → JS date
    const day = jsDate.getDate();

    fetchConsumptionsData(jsDate, day);
  };

  const handlePvDateChange = (date) => {
    if (!date) return;
    const jsDate = date.toDate();
    const day = jsDate.getDate();

    fetchPvProductionData(jsDate, day);
  };

  const handleBatteryDateChange = (date) => {
    if (!date) return;
    const jsDate = date.toDate();
    const day = jsDate.getDate();

    fetchBatterySystemData(jsDate, day);
  };

  useEffect(() => {
    const today = new Date();
    const day = today.getDate();

    fetchWeatherReadingsData();
    fetchComponentsTableData();
    fetchSolarLiveData({ silent: false });
    fetchConsumptionsData(today, day);
    fetchPvProductionData(today, day);
    fetchBatterySystemData(today, day);
  }, [
    fetchWeatherReadingsData,
    fetchComponentsTableData,
    fetchSolarLiveData,
    fetchConsumptionsData,
    fetchPvProductionData,
    fetchBatterySystemData,
  ]);

  useEffect(() => {
    if (Number.isFinite(solar.solarLiveRefreshIntervalSeconds) && solar.solarLiveRefreshIntervalSeconds > 0) {
      liveRefreshSecondsRef.current = solar.solarLiveRefreshIntervalSeconds;
    }
  }, [solar.solarLiveRefreshIntervalSeconds]);

  useEffect(() => {
    const clearLivePoll = () => {
      if (livePollIntervalRef.current) {
        clearInterval(livePollIntervalRef.current);
        livePollIntervalRef.current = null;
      }
    };

    const startLivePoll = () => {
      clearLivePoll();
      if (document.visibilityState !== "visible") return;
      livePollIntervalRef.current = setInterval(() => {
        fetchSolarLiveData({ silent: true });
      }, liveRefreshSecondsRef.current * 1000);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchSolarLiveData({ silent: true });
        startLivePoll();
      } else {
        clearLivePoll();
      }
    };

    startLivePoll();
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearLivePoll();
    };
  }, [fetchSolarLiveData, solar.solarLiveRefreshIntervalSeconds]);

  useEffect(() => {
    if (solar) {
      setWeatherContentsData(solar?.weatherReadingsData);
      setTableContentsData(solar?.componentsTableData);
      setConsumptionChartContents(solar?.consumptionChartData);
      setPvProductionChartContents(solar?.pvProductionChartData);
      setBatteryChartContents(solar?.batteryChartData);
    }
  }, [solar]);

  const liveSnapshot = solar?.solarLiveData && typeof solar.solarLiveData === "object" ? solar.solarLiveData : null;
  const flowDiagramData = mapLiveToFlowData(liveSnapshot);
  const livePv = liveSnapshot?.pv ?? {};
  const showLiveInitialLoading = solar.solarLiveLoading && !liveSnapshot;

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
    battery_charge: h.battery_charge_kwh ?? 0,
    battery_discharge: h.battery_discharge_kwh ?? 0,
    soc_pct: h.soc_pct,
  })) || [];

  const IconLabel = ({ icon, text }) => (
  <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
    <img src={icon} alt="" style={{ width: 16, height: 16 }} />
    {text}
  </span>
);

  return (
    <div className="solar-overview">
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {/* Top row: Left gauge card + Right flow card – stacked on mobile, side-by-side on desktop */}
      <Row gutter={16} className="overview-top-row">
        <Col xs={24} sm={24} md={24} lg={10} xl={10}>
          <Spin spinning={solar.weatherReadingsLoading}>
            <Card className="left-card">
              <div className="left-card-header">
                <div className="header-left">
                  <div className="header-text">
                    <div className="location">
                      <IconLabel icon={locationLogo} className="icon-small" />
                      {weatherContentsData?.weather?.city || "--"} —{" "}
                      {weatherContentsData?.weather?.condition || "--"}{" "}
                      {weatherContentsData?.weather?.temperature_c
                        ? `${weatherContentsData.weather.temperature_c}°C`
                        : "--"}
                    </div>

                    <div className="sun-info">
                      <IconLabel icon={sunLogo} text="Sunshine" />
                      {weatherContentsData?.weather?.sunshine || "--"}{" "}
                      <p>(UTC+01)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Spin spinning={showLiveInitialLoading}>
                <div className="left-card-body">
                  <div className="gauge-area">
                    <CircleGauge
                      value={livePv.kw ?? 0}
                      max={livePv.installed_capacity_kwp ?? 100}
                      percentage={livePv.percentage ?? 0}
                      size={158}
                      segments={30}
                    />
                  </div>

                  <div className="gauge-stats">
                    <div className="stat-row">
                      <span className="dot dot-active" />
                      <div>
                        <div className="stat-label">PV Production</div>
                        <div className="stat-value">
                          {formatSummaryNumber(livePv.kw, 3)} kW
                        </div>
                      </div>
                    </div>

                    <div className="stat-row">
                      <span className="dot dot-muted" />
                      <div>
                        <div className="stat-label">Installed Capacity</div>
                        <div className="stat-value">
                          {formatSummaryNumber(livePv.installed_capacity_kwp, 1)} kWp
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Spin>
            </Card>
          </Spin>
        </Col>
        <Col xs={24} sm={24} md={24} lg={14} xl={14}>
          <Spin spinning={solar.componentsTableLoading}>
            <Card className="summary-card">
              <EnergySummary tableContentsData={tableContentsData} />
            </Card>
          </Spin>
        </Col>
      </Row>  
         {/* Flow Diagram animation */}
      <Row gutter={16} className="svg-row">
        <Col span={24}>
        <Spin spinning={showLiveInitialLoading}>
          <Card className="animation-card">
            <FlowDiagram inverterData={flowDiagramData} />
          </Card>
        </Spin>
        </Col>
      </Row>
      {/* Charts section — unchanged structure */}
      <Row gutter={16} className="charts-row">
        <Col span={24}>
          <Spin spinning={solar.consumptionChartLoading}>
            <Card className="custom-card">
              <h3 className="solarPage-cardLabel">Consumption</h3>
              <div className="chart-header">
                <DatePicker
                  placeholder="Select period"
                  onChange={handleConsumptionDateChange}
                  style={{ borderRadius: 6, height: 40, marginRight: 10 }}
                  disabledDate={(current) =>
                    current && current.isAfter(dayjs(), "day")
                  }
                  allowClear={false}
                />
                <Select className="custom-filter" value={parameters} onChange={setParameters} style={{ width: 150 }} suffixIcon={null}>
                  <Option value="Parameters">
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: 0,
                      margin: 0
                    }}>
                      <span style={{ fontSize: 13, marginTop: -1 }}>All Parameters</span>
                      <img
                        src={parametersImg}
                        alt=""
                        style={{
                          width: 16,
                          height: 16,
                          objectFit: "contain",
                          marginTop: -2   // reduces the bottom spacing
                        }}
                      />
                    </div>
                  </Option>
                  <Option value="pv">Production</Option>
                  <Option value="grid">Grid</Option>
                  <Option value="load">Load</Option>
                </Select>
              </div>
              {(consumptionChartContents?.total_production_kwh != null
                || consumptionChartContents?.total_consumption_kwh != null) && (
                <div className="solar-chart-stat-badges">
                  {consumptionChartContents?.total_production_kwh != null ? (
                    <ChartDayStatBadge
                      label="Total Production"
                      value={formatSummaryNumber(consumptionChartContents.total_production_kwh, 1)}
                      unit="kWh"
                      variant="production"
                    />
                  ) : null}
                  {consumptionChartContents?.total_consumption_kwh != null ? (
                    <ChartDayStatBadge
                      label="Total Consumption"
                      value={formatSummaryNumber(consumptionChartContents.total_consumption_kwh, 1)}
                      unit="kWh"
                      variant="consumption"
                    />
                  ) : null}
                </div>
              )}
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
                      stroke="#FCCC43B2"
                      fill="#FCCC43B2"
                    />
                  )}

                  {(!parameters || parameters === "Parameters" || parameters === "grid") && (
                    <Area
                      type="monotone"
                      dataKey="grid"
                      name="Grid (kW)"
                      stroke="#0078FF"
                      fill="#0078FF"
                    />
                  )}

                  {(!parameters || parameters === "Parameters" || parameters === "load") && (
                    <Area
                      type="monotone"
                      dataKey="load"
                      name="Load (kW)"
                      stroke="#D7C6F3"
                      fill="#D7C6F3"
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Spin>
        </Col>
      </Row>

      <Row gutter={16} className="charts-row">
        <Col span={24}>
          <Spin spinning={solar.pvProductionChartLoading}>
            <Card className="custom-card">
              <h3 className="solarPage-cardLabel">PV Production</h3>
              <div className="chart-header">
                <DatePicker
                  placeholder="Select period"
                  onChange={handlePvDateChange}
                  style={{ borderRadius: 6, height: 40 }}
                  disabledDate={(current) =>
                    current && current.isAfter(dayjs(), "day")
                  }
                  allowClear={false}
                />
              </div>
              {(pvProductionChartContents?.daily_total_production_kwh != null
                || pvProductionChartContents?.peak_daily_production_kw != null) && (
                <div className="solar-chart-stat-badges">
                  {pvProductionChartContents?.daily_total_production_kwh != null ? (
                    <ChartDayStatBadge
                      label="Daily Total Production"
                      value={formatSummaryNumber(pvProductionChartContents.daily_total_production_kwh, 1)}
                      unit="kWh"
                      variant="pv-total"
                    />
                  ) : null}
                  {pvProductionChartContents?.peak_daily_production_kw != null ? (
                    <ChartDayStatBadge
                      label="Peak Daily Production"
                      value={formatSummaryNumber(pvProductionChartContents.peak_daily_production_kw, 1)}
                      unit="kW"
                      subLabel={
                        pvProductionChartContents.peak_daily_production_at
                          ? `at ${pvProductionChartContents.peak_daily_production_at}`
                          : null
                      }
                      variant="pv-peak"
                    />
                  ) : null}
                </div>
              )}
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
                    stroke="#0078FF99"
                    fill="#0078FF99"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Spin>
        </Col>
      </Row>

      <Row gutter={16} className="yield-row">
        <Col span={24}>
          <Spin spinning={solar.batteryChartLoading}>
            <Card className="custom-card">
              <h3 className="solarPage-cardLabel">Battery</h3>
              <div className="chart-header">
                <DatePicker
                  placeholder="Select period"
                  onChange={handleBatteryDateChange}
                  style={{ borderRadius: 6, height: 40 }}
                  disabledDate={(current) =>
                    current && current.isAfter(dayjs(), "day")
                  }
                  allowClear={false}
                />
              </div>
              {(batteryChartContents?.total_battery_charge_kwh != null
                || batteryChartContents?.total_battery_discharge_kwh != null) && (
                <div className="solar-chart-stat-badges">
                  {batteryChartContents?.total_battery_charge_kwh != null ? (
                    <ChartDayStatBadge
                      label="Total Battery Charge"
                      value={formatSummaryNumber(batteryChartContents.total_battery_charge_kwh, 1)}
                      unit="kWh"
                      variant="battery-charge"
                    />
                  ) : null}
                  {batteryChartContents?.total_battery_discharge_kwh != null ? (
                    <ChartDayStatBadge
                      label="Total Battery Discharge"
                      value={formatSummaryNumber(batteryChartContents.total_battery_discharge_kwh, 1)}
                      unit="kWh"
                      variant="battery-discharge"
                    />
                  ) : null}
                </div>
              )}
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={batteryChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip content={<BatteryChartTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="battery_charge" stroke="#D7C6F3" fill="#D7C6F3" />
                  <Area type="monotone" dataKey="battery_discharge" stroke="#58B90A" fill="#58B90A" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

const mapDispatchToProps = {
  fetchWeatherReadingsData,
  fetchComponentsTableData,
  fetchSolarLiveData,
  fetchConsumptionsData,
  fetchPvProductionData,
  fetchBatterySystemData,
};

const mapStateToProps = (state) => ({
  solar: state.solarReducer,
});

export default connect(mapStateToProps, mapDispatchToProps)(SolarOverviewPage);