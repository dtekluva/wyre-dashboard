import React, { useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchGenFuelUsageData } from "../redux/actions/diesel/diesel.action";
import { getMonthYear } from "../helpers/genericHelpers";
import { Spin } from "antd";

const FuelUsageBreakupCard = ({ genFuelUsageData, fetchGenFuelUsageData, diesel, loader }) => {
  const [frequency, setFrequency] = useState("daily");
  const devices =
    genFuelUsageData?.data && Array.isArray(genFuelUsageData.data)
      ? genFuelUsageData.data
      : [];

  // Build chart data
  const chartData = useMemo(() => {
    if (!devices || devices.length === 0) return [];

    const datesSet = new Set();
    devices.forEach((device) => {
      const s = device.series;
      if (Array.isArray(s)) {
        s.forEach((pt) => pt?.date && datesSet.add(pt.date));
      }
    });

    const dates = Array.from(datesSet).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return dates.map((date) => {
      const row = { date };

      devices.forEach((device) => {
        const series = Array.isArray(device.series) ? device.series : [];
        const pt = series.find((p) => p?.date === date) || {};
        row[`${device.name}_kwh`] = pt.kwh ?? 0;
        row[`${device.name}_fuel`] = pt.fuel_liters ?? 0;
      });

      return row;
    });
  }, [genFuelUsageData, frequency]);

  const palette = ["#5C12A7", "#FCCC43", "#52AC0B", "#FF6B6B"];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || payload.length === 0) return null;

    const grouped = {};
    payload.forEach((p) => {
      const key = p.dataKey;
      if (!key || typeof key !== "string") return;
      const lastUnd = key.lastIndexOf("_");
      if (lastUnd === -1) return;
      const genName = key.substring(0, lastUnd);
      const type = key.substring(lastUnd + 1);

      if (!grouped[genName]) grouped[genName] = { kwh: 0, fuel: 0, color: p.color };
      if (type === "kwh") grouped[genName].kwh = p.value || 0;
      if (type === "fuel") grouped[genName].fuel = p.value || 0;
    });
    return (
      <div className="fub-tooltip">
        <div className="fub-tooltip-label">{label}</div>
        {Object.keys(grouped).map((gen) => (
          <div key={gen} className="fub-tooltip-row">
            <span className="fub-tooltip-gen" style={{ color: grouped[gen].color }}>
              {gen}:
            </span>
            <span className="fub-tooltip-values">
              {grouped[gen].kwh} kWh / {grouped[gen].fuel} L
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Date formatter depending on frequency
  const formatDate = (str) => {
    const d = new Date(str);
    if (isNaN(d)) return str;

    if (frequency === "monthly") {
      return d.toLocaleString("default", { month: "short", year: "numeric" }); // e.g. Sep
    } else {
      return `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`; // e.g. Sep 15
    }
  };

const handleDailyView = () => {
  setFrequency("daily");
  fetchGenFuelUsageData(new Date(), "daily"); // or pass the currently selected date
};

const handleMonthlyView = () => {
  setFrequency("monthly");
  fetchGenFuelUsageData(new Date(), "monthly"); // or pass the currently selected date
};


  return (
    <div className="card">
      <Spin spinning={loader}>
        <div className="card-header">
          <h3 className="card-title">Generator fuel usage breakup</h3>
          <div className="fub-toggle">
            <button
              className={frequency === "daily" ? "fub-toggle-btn active" : "fub-toggle-btn"}
              onClick={handleDailyView}
              type="button"
            >
              Daily
            </button>
            <button
              className={frequency === "monthly" ? "fub-toggle-btn active" : "fub-toggle-btn"}
              onClick={handleMonthlyView}
              type="button"
            >
              Monthly
            </button>
          </div>
        </div>

        <div className="card-body">
          {chartData.length === 0 ? (
            <div className="fub-no-data">No data available</div>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData} margin={{ top: 8, right: 12, left: 18, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e6f0" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  yAxisId="left"
                  width={70}
                  label={{ 
                    value: "Energy (kWh)", 
                    angle: -90, position: "insideLeft", 
                    offset: -7,
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  width={70}
                  label={{ value: "Fuel (L)", angle: -90, position: "insideRight" }}
                />
                <Tooltip content={<CustomTooltip />} />

                {devices.map((device, i) => {
                  const colorKwh = palette[(i * 1 + 2) % palette.length];
                  const colorFuel = palette[(i * 2 + 1) % palette.length];
                  return (
                    <React.Fragment key={device.device_id || device.name}>
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey={`${device.name}_kwh`}
                        stroke={colorKwh}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey={`${device.name}_fuel`}
                        stroke="none"
                        dot={false}
                      />
                    </React.Fragment>
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </Spin>
    </div>
  );
};

const mapDispatchToProps = {
  fetchGenFuelUsageData,
};

const mapStateToProps = (state) => ({
  diesel: state.dieselReducer,
});

export default connect(mapStateToProps, mapDispatchToProps)(FuelUsageBreakupCard);