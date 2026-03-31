import { useMemo, useState } from "react";
import { connect } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fetchGenFuelUsageData } from "../redux/actions/diesel/diesel.action";
import { Spin } from "antd";

/** Extra headroom above data max so peaks aren’t flush with the top (dual-axis friendly ticks). */
const HEADROOM_FACTOR = 1.18;

function ceilToNiceStep(value, step) {
  return Math.ceil(value / step) * step;
}

function yAxisMaxWithHeadroom(dataMax, headroomFactor = HEADROOM_FACTOR) {
  if (dataMax == null || !Number.isFinite(dataMax) || dataMax <= 0) {
    return 100;
  }
  const target = dataMax * headroomFactor;
  if (target < 50) return ceilToNiceStep(target, 5);
  if (target < 200) return ceilToNiceStep(target, 10);
  if (target < 1000) return ceilToNiceStep(target, 50);
  if (target < 5000) return ceilToNiceStep(target, 100);
  return ceilToNiceStep(target, 500);
}

const FuelUsageBreakupCard = ({ genFuelUsageData, fetchGenFuelUsageData, diesel, loader }) => {
  const [frequency, setFrequency] = useState("daily");
  const devices = useMemo(() => 
    genFuelUsageData?.data && Array.isArray(genFuelUsageData.data)
      ? genFuelUsageData.data
      : [],
    [genFuelUsageData?.data]
  );

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
  }, [devices]);

  const { kwhAxisMax, fuelAxisMax } = useMemo(() => {
    let maxKwh = 0;
    let maxFuel = 0;
    for (const row of chartData) {
      for (const device of devices) {
        const k = row[`${device.name}_kwh`];
        const f = row[`${device.name}_fuel`];
        if (typeof k === "number" && k > maxKwh) maxKwh = k;
        if (typeof f === "number" && f > maxFuel) maxFuel = f;
      }
    }
    return {
      kwhAxisMax: yAxisMaxWithHeadroom(maxKwh),
      fuelAxisMax: Math.max(
        100,
        ceilToNiceStep(yAxisMaxWithHeadroom(maxFuel, HEADROOM_FACTOR), 100)
      ),
    };
  }, [chartData, devices]);

  /** Even steps 0…max so labels read like 0, 200, 400, 600, 800 */
  const fuelAxisTicks = useMemo(() => {
    const max = fuelAxisMax;
    const divisions = 4;
    return Array.from({ length: divisions + 1 }, (_, i) =>
      Math.round((max * i) / divisions)
    );
  }, [fuelAxisMax]);

  const palette = ["#5C12A7", "#FCCC43", "#52AC0B", "#FF6B6B"];

  const formatDate = (str) => {
    const d = new Date(str);
    if (isNaN(d)) return str;

    if (frequency === "monthly") {
      return d.toLocaleString("default", { month: "short", year: "numeric" });
    }
    return `${d.toLocaleString("default", { month: "short" })} ${d.getDate()}`;
  };

  const CustomTooltip = ({ active, label }) => {
    if (!active || label == null) return null;
    const row = chartData.find((r) => r.date === label);
    if (!row) return null;

    return (
      <div className="fub-tooltip">
        <div className="fub-tooltip-label">{formatDate(label)}</div>
        {devices.map((device, i) => {
          const color = palette[(i * 1 + 2) % palette.length];
          const kwh = row[`${device.name}_kwh`] ?? 0;
          const fuel = row[`${device.name}_fuel`] ?? 0;
          return (
            <div key={device.device_id || device.name} className="fub-tooltip-row">
              <span className="fub-tooltip-gen" style={{ color }}>
                {device.name}:
              </span>
              <span className="fub-tooltip-values">
                {kwh} kWh / {fuel} L
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  const handleDailyView = () => {
    setFrequency("daily");
    fetchGenFuelUsageData(new Date(), "daily");
  };

  const handleMonthlyView = () => {
    setFrequency("monthly");
    fetchGenFuelUsageData(new Date(), "monthly");
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
            <ResponsiveContainer width="100%" height={380}>
              <LineChart
                data={chartData}
                margin={{ top: 14, right: 40, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="2 4" stroke="#e8e8ef" strokeOpacity={0.95} />
                <XAxis
                  dataKey="date"
                  type="category"
                  tickFormatter={formatDate}
                  angle={-30}
                  textAnchor="end"
                  height={52}
                  tick={{ fill: "#6e6e78", fontSize: 11 }}
                  axisLine={{ stroke: "#d8d8e0" }}
                  tickLine={{ stroke: "#d8d8e0" }}
                  padding={{ left: 8, right: 8 }}
                />
                <YAxis
                  yAxisId="left"
                  width={68}
                  domain={[0, kwhAxisMax]}
                  tickCount={5}
                  allowDecimals={false}
                  tick={{ fill: "#6e6e78", fontSize: 11 }}
                  axisLine={{ stroke: "#d8d8e0" }}
                  tickLine={{ stroke: "#d8d8e0" }}
                  label={{
                    value: "Energy (kWh)",
                    angle: -90,
                    position: "insideLeft",
                    offset: -2,
                    style: { fill: "#4b4f52", fontSize: 12 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  width={42}
                  domain={[0, fuelAxisMax]}
                  ticks={fuelAxisTicks}
                  allowDecimals={false}
                  tick={{ fill: "#6e6e78", fontSize: 11, dx: -10 }}
                  axisLine={{ stroke: "#d8d8e0" }}
                  tickLine={{ stroke: "#d8d8e0" }}
                  label={{
                    value: "Fuel (L)",
                    angle: -90,
                    position: "right",
                    offset: 14,
                    style: { fill: "#4b4f52", fontSize: 12 },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  height={40}
                  wrapperStyle={{ paddingTop: 8 }}
                  iconType="plainline"
                  formatter={(value) => (
                    <span className="fub-legend-label">{value}</span>
                  )}
                />

                {devices.map((device, i) => {
                  const color = palette[(i * 1 + 2) % palette.length];
                  return (
                    <Line
                      key={device.device_id || device.name}
                      yAxisId="left"
                      name={device.name}
                      type="basis"
                      dataKey={`${device.name}_kwh`}
                      stroke={color}
                      strokeWidth={1.15}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dot={false}
                      activeDot={false}
                      connectNulls
                    />
                  );
                })}
                {/* Binds right-axis scale / ticks (no visible stroke); Recharts skips fuel ticks without a right-axis line */}
                {devices[0] ? (
                  <Line
                    yAxisId="right"
                    dataKey={`${devices[0].name}_fuel`}
                    stroke="none"
                    strokeWidth={0}
                    dot={false}
                    activeDot={false}
                    legendType="none"
                    isAnimationActive={false}
                    connectNulls
                  />
                ) : null}
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