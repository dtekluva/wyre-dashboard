import React, { useState, useEffect, useRef } from "react";
import { Image, Card, Table, Spin } from "antd";
import { useSelector } from "react-redux";
import { fetchReportData } from "../report/reportApi";
import fallbackData from "../report/newreport.json";
import {
  deviationUsageBreakdownColumn,
  deviationUtitlityAndDieselColumn,
} from "../helpers/reportTableColumns";
import "../report/report.css";

import { Doughnut } from "react-chartjs-2";
import { Bar, Chart as ReactChart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Filler,
  Title,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  LineController,
  BarController,
  Filler,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const logoSrc = "/ReportIcons/Wyre-logo.png";
const tilderSrc = "/ReportIcons/tilder.png";
const icon1Src = "/ReportIcons/energy-icon.svg";
const icon2Src = "/ReportIcons/utility-icon.svg";
const icon3Src = "/ReportIcons/diesel-icon.svg";
const icon4Src = "/ReportIcons/solar-icon.svg";
const icon5Src = "/ReportIcons/deviation-icon.svg";
const icon6Src = "/ReportIcons/energy-usage-icon.svg";
const infoCircleSrc = "/ReportIcons/info-circle.svg";

function MonthlyReport({ month, year }) {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sideBar = useSelector((state) => state.sideBar);
  const branchId = sideBar?.sideBarData?.branches?.[0]?.branch_id;

  const formatDeviceName = (name) => {
    return name.replace(/_/g, " ");
  };

  const [isLoadingNewReport, setIsLoadingNewReport] = useState(false);
  const reportRef = useRef(null);
  const isFirstDateRender = useRef(true);

  useEffect(() => {
    if (isFirstDateRender.current) {
      isFirstDateRender.current = false;
      return;
    }
    setIsLoadingNewReport(true);
  }, [month, year]);

  useEffect(() => {
    let isMounted = true;

    const loadReportData = async () => {
      if (sideBar.fetchSideBarLoading) {
        return;
      }

      if (!branchId) {
        if (!sideBar.fetchSideBarLoading) {
          setError("No branch available. Please try again later.");
          setLoading(false);
          setIsLoadingNewReport(false);
        }
        return;
      }

      setError(null);

      try {
        const data = await fetchReportData(branchId, month, year);
        if (isMounted) {
          setReportData(data);
          setError(null);
        }
      } catch (err) {
        console.error("Error loading report data:", err);
        if (isMounted) {
          setError("Failed to load report data");
          setReportData(fallbackData);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsLoadingNewReport(false);
        }
      }
    };

    loadReportData();

    return () => {
      isMounted = false;
    };
  }, [branchId, month, year, sideBar.fetchSideBarLoading]);

  if (sideBar.fetchSideBarLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Spin size="large" />
        <h2>Loading branches...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2 style={{ color: "#ff4d4f" }}>{error}</h2>
        <Spin size="large" />
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Spin size="large" />
        <h2>Loading report data...</h2>
      </div>
    );
  }

  if (!reportData && !loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <h2>No data available!</h2>
        <Spin size="large" />
      </div>
    );
  }

  const isSolar = Boolean(reportData.has_solar);

  // Branch type drives how power demand is presented.
  // - Commercial: operational + non_operational + weekends (the legacy view).
  // - Residential: weekdays + weekends only.
  // The payload now ships different keys per branch type, so we pull the
  // segments through `power_demand` defensively and fall back to an empty
  // shape if the expected key is missing.
  const branchType = (reportData.branch_type || '').toLowerCase();
  const isResidential = branchType === 'residential' || reportData.is_commercial === false;

  const emptyPowerDemand = { peak: 0, average: 0, minimum: 0, total_energy: '0kWh', unit: 'kVA' };
  const powerDemand = reportData.power_demand || {};
  const weekdaysData = powerDemand.weekdays || emptyPowerDemand;
  const operationalData = powerDemand.operational || emptyPowerDemand;
  const nonOperationalData = powerDemand.non_operational || emptyPowerDemand;
  const weekendData = powerDemand.weekends || emptyPowerDemand;

  const parseEnergy = (segment) => {
    const raw = (segment && segment.total_energy) || '0';
    const cleaned = String(raw).replace(/[^\d]/g, '');
    return parseInt(cleaned, 10) || 0;
  };

  const weekdaysEnergy = parseEnergy(weekdaysData);
  const operationalEnergy = parseEnergy(operationalData);
  const nonOperationalEnergy = parseEnergy(nonOperationalData);
  const weekendEnergy = parseEnergy(weekendData);

  const totalPowerDemandEnergy = isResidential
    ? weekdaysEnergy + weekendEnergy
    : operationalEnergy + nonOperationalEnergy + weekendEnergy;

  const breakdownPct = (value) =>
    totalPowerDemandEnergy === 0 ? '0.0' : ((value / totalPowerDemandEnergy) * 100).toFixed(1);

  const energy_usage_breakdown = isResidential
    ? [
      {
        key: '1',
        name: 'Weekdays',
        value: `${weekdaysEnergy.toLocaleString()}`,
        percentage: breakdownPct(weekdaysEnergy)
      },
      {
        key: '2',
        name: 'Weekends',
        value: `${weekendEnergy.toLocaleString()}`,
        percentage: breakdownPct(weekendEnergy)
      }
    ]
    : [
      {
        key: '1',
        name: 'Operational Period',
        value: `${operationalEnergy.toLocaleString()}`,
        percentage: breakdownPct(operationalEnergy)
      },
      {
        key: '2',
        name: 'Non-Operational Period',
        value: `${nonOperationalEnergy.toLocaleString()}`,
        percentage: breakdownPct(nonOperationalEnergy)
      },
      {
        key: '3',
        name: 'Weekend Period',
        value: `${weekendEnergy.toLocaleString()}`,
        percentage: breakdownPct(weekendEnergy)
      }
    ];

  // Helper to safely parse numbers and avoid NaN
  const safeParse = (val, fallback = 0) => {
    const num = parseFloat(val);
    return isNaN(num) ? fallback : num;
  };

  // Currency formatter for Nigerian Naira (no decimals for display)
  const formatNaira = (val) => {
    const amount = safeParse(val);
    return `\u20A6${Math.round(amount).toLocaleString()}`;
  };

  // Solar view-model derived from `energy_generated.<period>.devices.solar[0]`.
  // Periods map to the rows of the "Solar Savings Impact" card.
  const getSolarEntry = (period) =>
    reportData.energy_generated?.[period]?.devices?.solar?.[0] || null;

  const solarCurrent = getSolarEntry('current_month');
  const solarPrevious = getSolarEntry('previous_month_1');
  const solarThisYear = getSolarEntry('this_year');
  const solarSinceCommission = getSolarEntry('since_commission');

  // 5/10-year projections = current month values * 12 months * N years
  const currentMonthSavings = safeParse(solarCurrent?.savings);
  const currentMonthSolarEnergy = safeParse(solarCurrent?.solar_energy);
  const currentMonthContribution = safeParse(solarCurrent?.contribution);
  const previousMonthSavings = safeParse(solarPrevious?.savings);
  const projectionSavings5Y = currentMonthSavings * 12 * 5;
  const projectionSolarEnergy5Y = currentMonthSolarEnergy * 12 * 5;
  const projectionSavings = currentMonthSavings * 12 * 10;
  const projectionSolarEnergy = currentMonthSolarEnergy * 12 * 10;

  // Month-over-month savings delta used for the headline trend indicator.
  const savingsDelta = currentMonthSavings - previousMonthSavings;
  const savingsDeltaPct = previousMonthSavings > 0
    ? (savingsDelta / previousMonthSavings) * 100
    : 0;
  const savingsTrendPositive = savingsDelta >= 0;

  const formatEnergy = (val) => `${Math.round(safeParse(val)).toLocaleString()}`;
  const formatContribution = (val) => `${safeParse(val).toFixed(1)}%`;

  // For energy per source and top 7 contributors chart (current month only, utility grouped, generators listed)
  const currentGenEntries = (reportData.energy_generated?.current_month?.devices?.generator?.entries || []);
  const currentUtilityEntries = (reportData.energy_generated?.current_month?.devices?.utility || []);
  const currentSolarEntries = (reportData.energy_generated?.current_month?.devices?.solar || []);

  const utilityTotal = currentUtilityEntries.reduce((sum, device) => sum + safeParse((device.device_energy || '').split(' ')[0]), 0);
  const solarTotal = currentSolarEntries.reduce((sum, device) => sum + safeParse((device.device_energy || '').split(' ')[0]), 0);
  const generatorLabels = currentGenEntries.map(device => formatDeviceName(device.name));
  const generatorData = currentGenEntries.map(device => safeParse((device.device_energy || '').split(' ')[0]));
  const generatorColors = ['#F9CF40', '#34D5FD', '666fff', '#4B8AFF', 'gray', '#4B8AFF'];

  // Build a single source list so the doughnut, bar chart and legend stay in
  // sync. Utility is always first (brand purple); solar is appended when the
  // site has solar (green to signal renewable/clean energy and read
  // distinctly from the generator yellow); generators fan out with their
  // palette.
  const sources = [
    { label: 'UTILITY', value: utilityTotal, color: '#9640FF' },
    ...generatorLabels.map((label, idx) => ({
      label,
      value: generatorData[idx],
      color: generatorColors[idx % generatorColors.length]
    })),
    ...(solarTotal > 0
      ? [{ label: 'SOLAR', value: solarTotal, color: '#43D540' }]
      : [])
  ];

  const chartLabels = sources.map((s) => s.label);
  const chartData = sources.map((s) => s.value);
  const chartColors = sources.map((s) => s.color);
  const totalSourceEnergy = chartData.reduce((sum, val) => sum + val, 0);

  const energySourceData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData.map((val) =>
          totalSourceEnergy === 0
            ? 0
            : Number(((val / totalSourceEnergy) * 100).toFixed(1))
        ),
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  };

  // For top 7 contributors chart (current month only, utility grouped, generators listed)
  const topDevices = sources
    .map((s) => ({ label: s.label, value: s.value, color: s.color }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);
  const dataSource = {
    labels: topDevices.map(d => d.label),
    datasets: [
      {
        data: topDevices.map(d => d.value),
        backgroundColor: topDevices.map((d) => d.color),
        borderRadius: 999,
        barThickness: 40,
        borderSkipped: false,
      }
    ],
  };

  // Update the chart legend section for new grouping
  const chartLegend = chartLabels.map((label, idx) => {
    const value = chartData[idx];
    return (
      <div className="legend-item" key={label}>
        <span className="legend-dot" style={{ backgroundColor: chartColors[idx] }}></span>
        <span className="legend-label" style={{ fontSize: 17 }}>
          {label}: {value.toLocaleString()} kWh ({totalSourceEnergy === 0 ? '0.0' : ((value / totalSourceEnergy) * 100).toFixed(1)}%)
        </span>
      </div>
    );
  });

  // Utility and diesel data sources (only 3 months)
  const utilityDataSource = [
    ...(reportData.energy_generated?.current_month?.devices?.utility || []).map((device, index) => ({
      key: `current_${index}`,
      energy: safeParse((device.device_energy || '').split(' ')[0]).toLocaleString(),
      time_of_use: safeParse(device.time_of_use).toLocaleString(),
      bill: safeParse(device.expected_bill).toLocaleString(),
      accuracy: safeParse(device.last_bill_accuracy).toFixed(1),
      actual_cost: safeParse(device.actual_cost).toLocaleString(),
      actual_energy: device.actual_energy || '0',
      usage_accuracy: device.usage_accuracy || '0%',
      month: device.month
    })),
    ...(reportData.energy_generated?.previous_month_1?.devices?.utility || []).map((device, index) => ({
      key: `prev1_${index}`,
      energy: safeParse((device.device_energy || '').split(' ')[0]).toLocaleString(),
      time_of_use: safeParse(device.time_of_use).toLocaleString(),
      bill: safeParse(device.expected_bill).toLocaleString(),
      accuracy: safeParse(device.last_bill_accuracy).toFixed(1),
      actual_cost: safeParse(device.actual_cost).toLocaleString(),
      actual_energy: device.actual_energy || '0',
      usage_accuracy: device.usage_accuracy || '0%',
      month: device.month
    })),
    ...(reportData.energy_generated?.previous_month_2?.devices?.utility || []).map((device, index) => ({
      key: `prev2_${index}`,
      energy: safeParse((device.device_energy || '').split(' ')[0]).toLocaleString(),
      time_of_use: safeParse(device.time_of_use).toLocaleString(),
      bill: safeParse(device.expected_bill).toLocaleString(),
      accuracy: safeParse(device.last_bill_accuracy).toFixed(1),
      actual_cost: safeParse(device.actual_cost).toLocaleString(),
      actual_energy: device.actual_energy || '0',
      usage_accuracy: device.usage_accuracy || '0%',
      month: device.month
    }))
  ];

  // Prepare data for table with merged month cells
  const dieselDataSource = [];
  const monthPeriods = ['current_month', 'previous_month_1', 'previous_month_2'];

  monthPeriods.forEach(period => {
    const monthData = reportData.energy_generated?.[period];
    if (monthData?.devices?.generator?.entries?.length > 0)
    {
      const entries = monthData.devices.generator.entries;
      const actualUsage = monthData.devices.generator.actual_usage || '0';

      entries.forEach((entry, idx) => {
        dieselDataSource.push({
          key: `${entry.month}_${idx}`,
          month: entry.month,
          actual_usage: safeParse(actualUsage).toLocaleString(),
          isFirst: idx === 0,
          rowSpan: idx === 0 ? entries.length : 0,
          energy: safeParse((entry.device_energy || '').split(' ')[0]).toLocaleString(),
          optimal_usage: safeParse((entry.optimal_usage || '').split(' ')[0]).toLocaleString(),
          time_of_use: safeParse(entry.time_of_use).toLocaleString(),
          bill: safeParse(entry.expected_bill).toLocaleString(),
          actual_cost: safeParse(entry.actual_cost).toLocaleString(),
          actual_cost_rowSpan: idx === 0 ? entries.length : 0,
          optimal_cost: safeParse(entry.optimal_cost).toLocaleString(),
          accuracy: safeParse(entry.last_bill_accuracy).toFixed(2),
          name: formatDeviceName(entry.name)
        });
      });
    }
  });

  // Define columns with rowSpan for month and actual_usage
  const dieselConsumptnColumn = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: (text, row) => {
        const obj = {
          children: text ? <span>{text}</span> : '',
          props: { rowSpan: row.rowSpan }
        };
        return obj;
      }
    },
    {
      title: 'Actual Usage (liters)',
      dataIndex: 'actual_usage',
      key: 'actual_usage',
      render: (text, row) => {
        const obj = {
          children: text ? <span>{text}</span> : '',
          props: { rowSpan: row.rowSpan }
        };
        return obj;
      }
    },
    {
      title: 'Device',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span>{text}</span>
    },
    {
      title: 'Total Energy (kWh)',
      dataIndex: 'energy',
      key: 'energy',
      render: (text) => <span>{text}</span>
    },
    {
      title: 'Optimal Usage (liters)',
      dataIndex: 'optimal_usage',
      key: 'optimal_usage',
      render: (text) => <span>{text}</span>
    },
    {
      title: 'Actual Cost (Naira)',
      dataIndex: 'actual_cost',
      key: 'actual_cost',
      render: (text, row) => {
        const obj = {
          children: text ? <span>{text}</span> : '',
          props: { rowSpan: row.actual_cost_rowSpan }
        };
        return obj;
      }
    },
    {
      title: 'Optimal Cost (Naira)',
      dataIndex: 'optimal_cost',
      key: 'optimal_cost',
      render: (text) => <span>{text}</span>
    },
    {
      title: 'Usage Accuracy (%)',
      dataIndex: 'accuracy',
      key: 'accuracy',
      render: (text) => <span>{text}</span>
    }
  ];

  // Deviation section is optional on the new payload; guard all reads so a
  // missing `energy_deviation_and_cost` object doesn't crash the page.
  const deviationCurrent = reportData.energy_deviation_and_cost?.current_month;
  const deviationPrev1 = reportData.energy_deviation_and_cost?.previous_month_1;
  const deviationPrev2 = reportData.energy_deviation_and_cost?.previous_month_2;
  const hasDeviationData = Boolean(deviationCurrent || deviationPrev1 || deviationPrev2);

  const buildDeviationRow = (key, row) => ({
    key,
    ...(row || {}),
    value: safeParse(row?.value, 0).toLocaleString(),
    deviation_time_of_use: safeParse(row?.deviation_time_of_use, 0).toLocaleString(),
    diesel_consumption: safeParse(row?.diesel_consumption, 0).toLocaleString(),
    deviation_cost: safeParse(row?.deviation_cost, 0).toLocaleString()
  });

  const deviationDataSource = hasDeviationData
    ? [
      buildDeviationRow('current', deviationCurrent),
      buildDeviationRow('prev1', deviationPrev1),
      buildDeviationRow('prev2', deviationPrev2)
    ].filter((row) => row && Object.keys(row).length > 1)
    : [];

  const formatDate = (dateString) => {
    const [month, year] = dateString.split('/');
    const date = new Date(year, month - 1);

    return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            const value = context.raw || 0;
            return `${value}%`;
          },
        },
      },
      datalabels: {
        color: "#FFFFFF",
        font: {
          weight: "bold",
          size: 16,
        },
        formatter: (value) => (value > 0 ? `${value}%` : ""),
      },
    },
    cutout: "55%",
  };


  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 30
      }
    },
    plugins: {
      legend: {
        display: false,
        label: {
          font: {
            size: 50,
            weight: '500'
          },
        }
      },
      title: {
        display: false
      },
      datalabels: {
        display: false,
        font: {
          size: 20,
          weight: '500'
        },
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 16,
            weight: 550
          },
          color: '#66666'
        },
        afterFit: function (scaleInstance) {
          scaleInstance.width = 140;
        }
      }
    },
    barPercentage: 0.8,
    categoryPercentage: 0.9
  };

  const fuelEfficiency = reportData.fuel_efficiency_accuracy_comparison;
  const generatorSizeEfficiency = reportData.generator_size_efficiency;
  const hasFuelEfficiency = Boolean(fuelEfficiency);
  const hasGeneratorSizeEfficiency = Boolean(generatorSizeEfficiency);

  const fuelEfficiencyDataSource = hasFuelEfficiency
    ? [
      {
        key: '1',
        recommended: `${fuelEfficiency.recommended?.value ?? ''} ${fuelEfficiency.recommended?.unit ?? ''}`.trim(),
        achieved: `${fuelEfficiency.achieved?.value ?? ''} ${fuelEfficiency.achieved?.unit ?? ''}`.trim(),
      },
    ]
    : [];

  const utilityConsumptnColumn = [
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: (text, record) => `${record.month || new Date().toLocaleString('default', { month: 'long' })}`
    },
    {
      title: 'Disco Energy (kWh)',
      dataIndex: 'actual_energy',
      key: 'actual_energy',
      render: (text) => text
    },
    {
      title: 'Wyre Energy (Meter) (kWh)',
      dataIndex: 'energy',
      key: 'energy',
      render: (text) => text
    },
    {
      title: 'Expected Bill (Naira)',
      dataIndex: 'bill',
      key: 'bill',
      render: (text) => text
    },
    {
      title: 'Disco Cost (Naira)',
      dataIndex: 'actual_cost',
      key: 'actual_cost',
      render: (text) => text
    },
    {
      title: 'Usage Accuracy (%)',
      dataIndex: 'usage_accuracy',
      key: 'usage_accuracy',
      render: (text) => text
    }
  ];

  const solarHourConsumptnColumn = [
    {
      title: 'Energy consumed during solar hours (kWh)',
      dataIndex: 'name',
      key: 'name',
      width: '70%'
    },
    {
      title: '',
      dataIndex: 'value',
      key: 'value',
      width: '30%'
    }
  ];

  // Power demand chart data — residential gets a 2-bucket view (weekdays +
  // weekends) while commercial keeps the original 3-bucket breakdown.
  const powerDemandLabels = isResidential
    ? ['weekdays', 'weekends']
    : ['operational', 'non-operational', 'weekend hours'];

  const powerDemandColors = isResidential
    ? ['#9640FF', '#4B8AFF']
    : ['#9640FF', '#F9CF40', '#4B8AFF'];

  const powerDemandSegments = isResidential
    ? [weekdaysData, weekendData]
    : [operationalData, nonOperationalData, weekendData];

  const buildPowerDemandValues = (key) =>
    powerDemandSegments.map((segment) => parseFloat(segment?.[key]) || 0);

  const powerDemandData = {
    labels: powerDemandLabels,
    datasets: [
      {
        label: 'Min',
        data: buildPowerDemandValues('minimum'),
        backgroundColor: powerDemandColors,
        borderRadius: 30,
        borderSkipped: false,
        maxBarThickness: 50,
        minBarLength: 2
      },
      {
        label: 'Average',
        data: buildPowerDemandValues('average'),
        backgroundColor: powerDemandColors,
        borderRadius: 30,
        borderSkipped: false,
        maxBarThickness: 50,
        minBarLength: 2
      },
      {
        label: 'Max',
        data: buildPowerDemandValues('peak'),
        backgroundColor: powerDemandColors,
        borderRadius: 30,
        borderSkipped: false,
        maxBarThickness: 50,
        minBarLength: 2
      }
    ]
  };

  const powerDemandOptions = {
    indexAxis: 'x',
    responsive: true,
    maintainAspectRatio: true,
    layout: {
      padding: {
        top: 20,
        bottom: 40,
        left: 20,
        right: 20
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 14,
          }
        }
      },
      y: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 14,
          },
        },
        min: 0,
        suggestedMax: 120,
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} kWh`;
          }
        }
      }
    },
    barPercentage: 0.9,
    categoryPercentage: 0.8
  };

  const bandCategorizationColumns = [
    {
      title: 'Band',
      dataIndex: 'band',
      key: 'band',
      render: (text) => <span style={{ fontSize: '20px' }}>{text}</span>
    },
    {
      title: 'Expected Hours',
      dataIndex: 'expectedHours',
      key: 'expectedHours',
      render: (text) => <span style={{ fontSize: '20px' }}>{text}</span>
    },
    {
      title: 'Total Hours (Achieved)',
      dataIndex: 'totalHours',
      key: 'totalHours',
      render: (text) => <span style={{ fontSize: '20px' }}>{text}</span>
    },
    {
      title: 'Blackout (hrs)',
      dataIndex: 'deviation',
      key: 'deviation',
      render: (text) => {
        const value = parseInt(text);
        return <span style={{ fontSize: '20px' }}>{value < 0 ? "---" : Math.abs(text)}</span>;
      },
    },
    {
      title: 'Percentage Compliance',
      dataIndex: 'compliance',
      key: 'compliance',
      render: (text) => <span style={{ fontSize: '20px' }}>{text}</span>
    }
  ];

  const bandCategorization = Array.isArray(reportData.utility_band_categorization)
    ? reportData.utility_band_categorization
    : [];
  const hasBandCategorization = bandCategorization.length > 0;

  const bandCategorizationData = bandCategorization.map((band, index) => {
    const expected = parseInt(band.expected_hours) || 0;
    const total = parseInt(band.total_hours) || 0;
    return {
      key: (index + 1).toString(),
      band: band.band,
      expectedHours: `${expected.toLocaleString()}`,
      totalHours: `${total.toLocaleString()}`,
      deviation: `${expected - total}`,
      compliance: `${expected === 0 ? '0.0' : ((total / expected) * 100).toFixed(1)}%`,
    };
  });

  const totalHours = bandCategorization.reduce((acc, band) => acc + (parseInt(band.total_hours) || 0), 0);
  const availableHours = bandCategorization.reduce((acc, band) => acc + (parseInt(band.expected_hours) || 0), 0);

  const bandCategorizationPieData = {
    labels: [
      'Total Month Hours',
      'Total Utility Available Hours'
    ],
    datasets: [{
      data: [totalHours, availableHours],
      backgroundColor: ['#9640FF', '#F9CF40'],
      borderWidth: 0,
      spacing: 0,
      weight: 1,
      circumference: 360
    }]
  };

  const hasDataEntry = reportData.data_entry != null && reportData.data_entry.value != null;
  const dataEntryValue = hasDataEntry ? parseFloat(reportData.data_entry.value) || 0 : 0;
  const remainingValue = 100 - dataEntryValue;

  const dataEntryScoreData = {
    labels: ['Completed', 'Remaining'],
    datasets: [{
      data: [dataEntryValue, remainingValue],
      backgroundColor: ['#9640FF', '#F0F0F0'],
      borderWidth: 0,
      spacing: 0,
      weight: 1,
      circumference: 360,
      rotation: 225
    }]
  };

  const bandPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        position: 'bottom',
        align: "left",
        labels: {
          padding: 20,
          font: {
            size: 14,
            position: "left",
            weight: '400'
          },
          color: '#515151',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'white',
        titleColor: '#000',
        bodyColor: '#000',
        padding: 12,
        boxWidth: 10,
        boxHeight: 10,
        boxPadding: 3,
        usePointStyle: true,
        callbacks: {
          title: (context) => {
            const label = context[0].label;
            return label;
          },
          label: (context) => {
            const value = context.raw;
            return `${value} hours (${((value / 720) * 100).toFixed(1)}%)`;
          }
        }
      },
      datalabels: {
        display: true,
        color: '#FFFFFF',
        font: {
          size: 11,
          weight: '700',
        },
        formatter: (value) => {
          return value + 'hrs';
        },
        anchor: 'center'
      }
    }
  };

  const dataEntryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '55%',
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'white',
        titleColor: '#000',
        bodyColor: '#000',
        padding: 12,
        callbacks: {
          title: () => 'Data Entry Progress',
          label: (context) => {
            const value = context.raw;
            return `${value}% ${context.datasetIndex === 0 ? 'Completed' : 'Remaining'}`;
          }
        }
      },
      datalabels: {
        display: false
      }
    }
  };

  // Battery daily usage — only render for solar customers and only when the
  // payload actually carries day-by-day rows.
  const batteryDailyUsage = reportData.battery_daily_usage;
  const batteryDays = Array.isArray(batteryDailyUsage?.days) ? batteryDailyUsage.days : [];
  const hasBatteryDailyUsage = isSolar && batteryDays.length > 0;

  const batteryDayLabels = batteryDays.map((d) => {
    const day = parseInt((d.date || '').split('-')[2], 10);
    return Number.isFinite(day) ? day : d.date;
  });
  const batteryEnergy = batteryDays.map((d) => safeParse(d.discharge_kwh));
  const batteryHours = batteryDays.map((d) => safeParse(d.discharge_hours));
  const batterySoc = batteryDays.map((d) => safeParse(d.max_soc));

  const batteryTotals = batteryDays.reduce(
    (acc, d) => {
      acc.energy += safeParse(d.discharge_kwh);
      acc.hours += safeParse(d.discharge_hours);
      acc.socSum += safeParse(d.max_soc);
      return acc;
    },
    { energy: 0, hours: 0, socSum: 0 }
  );
  const batteryAvgSoc = batteryDays.length > 0 ? batteryTotals.socSum / batteryDays.length : 0;
  const batteryAvgHours = batteryDays.length > 0 ? batteryTotals.hours / batteryDays.length : 0;

  // Brand palette for the battery chart:
  //   - Purple (#9640FF)  → energy delivered (primary metric, wide outer bar)
  //   - Blue   (#4B8AFF)  → discharge duration (narrower bar drawn ON TOP)
  //   - Green  (#43D540)  → max SOC (renewable accent, line overlay)
  const colorEnergy = '#9640FF';
  const colorDuration = '#4B8AFF';
  const colorSoc = '#43D540';

  // Layered bars — both bars share the same x position; the duration bar is
  // narrower so it sits visually inside the energy bar (à la the reference
  // design). Each metric uses its own y-axis so values stay accurate.
  const batteryDailyUsageData = {
    labels: batteryDayLabels,
    datasets: [
      {
        type: 'bar',
        label: 'Energy provided (kWh)',
        data: batteryEnergy,
        backgroundColor: colorEnergy,
        hoverBackgroundColor: colorEnergy,
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
        yAxisID: 'yEnergy',
        xAxisID: 'x',
        categoryPercentage: 0.95,
        barPercentage: 0.85,
        order: 3
      },
      {
        type: 'bar',
        label: 'Discharge duration (hours)',
        data: batteryHours,
        backgroundColor: colorDuration,
        hoverBackgroundColor: colorDuration,
        borderWidth: 0,
        borderRadius: 3,
        borderSkipped: false,
        yAxisID: 'yHours',
        xAxisID: 'xInner',
        categoryPercentage: 0.95,
        barPercentage: 0.45,
        order: 2
      },
      {
        type: 'line',
        label: 'Max SOC (%)',
        data: batterySoc,
        borderColor: colorSoc,
        backgroundColor: 'rgba(67, 213, 64, 0.08)',
        pointBackgroundColor: colorSoc,
        pointBorderColor: '#FFFFFF',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        borderWidth: 2.5,
        tension: 0.35,
        fill: false,
        yAxisID: 'ySoc',
        xAxisID: 'x',
        order: 1
      }
    ]
  };

  // The maximum hours observed sets the upper bound of the right-hand "Hours"
  // axis. We round up to a friendly 24h cap so the duration bar never visually
  // exceeds the energy bar for normal data, mirroring the reference design.
  const batteryHoursMax = batteryHours.length > 0 ? Math.max(...batteryHours) : 0;
  const batteryHoursAxisMax = Math.max(24, Math.ceil(batteryHoursMax / 6) * 6);

  const batteryDailyUsageOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    layout: {
      padding: { top: 24, bottom: 8, left: 4, right: 8 }
    },
    plugins: {
      legend: { display: false },
      datalabels: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#FFFFFF',
        titleColor: '#000',
        titleFont: { size: 13, family: 'Inter', weight: '600' },
        bodyColor: '#000',
        bodyFont: { size: 13, family: 'Inter' },
        borderColor: '#E5E5E5',
        borderWidth: 1,
        padding: 14,
        boxPadding: 6,
        usePointStyle: true,
        filter: (item) => item.dataset.xAxisID !== 'xInner' || item.dataIndex !== undefined,
        callbacks: {
          title: (items) => {
            if (!items.length) return '';
            const idx = items[0].dataIndex;
            const day = batteryDays[idx];
            return day?.date || `Day ${items[0].label}`;
          },
          label: (ctx) => {
            const v = safeParse(ctx.raw);
            if (ctx.dataset.yAxisID === 'yEnergy') return `Energy provided: ${v.toFixed(1)} kWh`;
            if (ctx.dataset.yAxisID === 'yHours') return `Discharge duration: ${v.toFixed(2)} h`;
            if (ctx.dataset.yAxisID === 'ySoc') return `Max SOC: ${v.toFixed(0)}%`;
            return `${ctx.dataset.label}: ${v}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        border: { display: false },
        ticks: {
          font: { size: 12, family: 'Inter', weight: '500' },
          color: '#515151',
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
          padding: 8,
          callback: function (value, index) {
            const label = this.getLabelForValue(value);
            const n = parseInt(label, 10);
            if (!Number.isFinite(n)) return label;
            if (index === 0 || index === batteryDayLabels.length - 1) return n;
            return n % 5 === 0 ? n : '';
          }
        }
      },
      // Hidden secondary x-axis so the inner (duration) bars share the same
      // category positions as the outer (energy) bars instead of being placed
      // side-by-side. Both axes use the same labels and offset.
      xInner: {
        display: false,
        grid: { display: false, drawBorder: false },
        offset: true,
        labels: batteryDayLabels
      },
      yEnergy: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        grid: {
          color: 'rgba(0,0,0,0.05)',
          drawBorder: false,
          lineWidth: 1
        },
        border: { display: false },
        ticks: {
          font: { size: 12, family: 'Inter' },
          color: '#515151',
          padding: 10,
          callback: (v) => `${v}`
        },
        title: {
          display: true,
          text: 'kWh',
          color: '#515151',
          font: { size: 13, family: 'Inter', weight: '500' },
          padding: { bottom: 12 }
        }
      },
      // Hidden axis whose only job is to give the duration bar a sensible
      // 0–24h range. Hours and kWh use very different magnitudes — without
      // this the duration bar would be invisibly small alongside kWh values.
      yHours: {
        type: 'linear',
        position: 'left',
        beginAtZero: true,
        max: batteryHoursAxisMax,
        display: false,
        grid: { display: false, drawBorder: false }
      },
      ySoc: {
        type: 'linear',
        position: 'right',
        min: 0,
        max: 100,
        grid: { display: false, drawBorder: false },
        border: { display: false },
        ticks: {
          font: { size: 12, family: 'Inter' },
          color: '#515151',
          padding: 10,
          callback: (v) => `${v}%`,
          stepSize: 25
        },
        title: {
          display: true,
          text: 'SOC %',
          color: '#515151',
          font: { size: 13, family: 'Inter', weight: '500' },
          padding: { bottom: 12 }
        }
      }
    }
  };

  return (
    <div className="report-page">
      {isLoadingNewReport && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Spin size="large" tip="Loading report..." />
        </div>
      )}

      <div className="main-layer" ref={reportRef}>
      <div className="layer-1">
        <section className="init-space">
          <div className="heading">
            <div className='wyre-logo'>
              <Image width={100} src={logoSrc} />
            </div>
            <h1
              style={{
                fontWeight: 650,
                marginBottom: "0.5rem",
                width: "100%",
                margin: "0 auto",
              }}
            >
              Monthly Energy Report for <span style={{ textTransform: "capitalize" }}>{reportData.branch_name}</span> <br /> <span style={{ textTransform: "capitalize" }}>{reportData.month}</span>, {reportData.year}
            </h1>
            <p>powered by Wyre</p>
          </div>
        </section>
        <section className="init-space">
          <div className="head-card">
            <Card className="title">
              <div>
                <h1 style={{ fontWeight: "590", marginTop: "18px", textAlign: "center" }}>
                  Total Energy Consumed:
                </h1>
              </div>
            </Card>
            <Card className="value">
              <h1 style={{ fontSize: "32Px", textAlign: "center" }}>
                <Image className="tilde" src={tilderSrc} preview={false} />
                <span className="amount" style={{ fontSize: "50px", marginLeft: "15px" }}>
                  {Number(
                    safeParse(reportData.total_energy.value) + (isSolar ? solarTotal : 0)
                  ).toLocaleString()}
                </span>
                <span className="unit" style={{ fontSize: "24px", fontWeight: "400" }}>{reportData.total_energy.unit}</span>
              </h1>
            </Card>
          </div>
        </section>
        <section className="init-space antCard">
          <Card className="energy-source-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "16px",
                alignItems: "center",
              }}
            >
              <div className="energy-source-header">
                <Image className="icon" src={icon1Src} preview={false} />
                <h1>Energy Consumed per Source</h1>
              </div>
              <div
                style={{
                  width: "35%",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <img src={infoCircleSrc} alt="info icon" />
                <p style={{ fontSize: 13, color: "#515151" }}>
                  This is the distribution of your energy consumption across
                  your power sources. Highlighting the source that was mostly
                  used.
                </p>
              </div>
            </div>
            <div className="energy-source-chart">
              <div className="energy-source-doughnut">
                <Doughnut
                  data={energySourceData}
                  options={doughnutOptions}
                  plugins={[ChartDataLabels]}
                />
              </div>
              <div className="energy-source-legend">
                {chartLabels.map((label, idx) => {
                  const value = chartData[idx];
                  const percent =
                    totalSourceEnergy === 0
                      ? "0.0"
                      : ((value / totalSourceEnergy) * 100).toFixed(1);
                  return (
                    <div className="energy-source-legend-item" key={label}>
                      <span
                        className="energy-source-legend-swatch"
                        style={{ backgroundColor: chartColors[idx] }}
                      />
                      <span className="energy-source-legend-text">
                        <b>{label}</b>: {value.toLocaleString()} kWh{" "}
                        <span className="energy-source-legend-pct">
                          ({percent}%)
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </section>
        {!isSolar && (
          <section className="init-space antCard">
            <Card className="top-contributors-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
                <div className="contributors-header">
                  <Image className="icon" src={icon1Src} preview={false} />
                  <div className="header-content">
                    <h1>Top {chartLabels.length > 7 ? "7" : ""} energy contributors</h1>
                    <div className="total-energy">
                      {Number(reportData.total_energy.value).toLocaleString()}<span>{reportData.total_energy.unit}</span></div>
                  </div>
                </div>
                <div style={{ width: "35%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={infoCircleSrc} alt="info icon" />
                  <p style={{ fontSize: 13, color: "#515151" }}>
                    Chart highlighting the top seven loads with the most energy consumption. This card is designed for bespoke account users
                  </p>
                </div>
              </div>
              <div className="chart-container">
                <Bar
                  data={dataSource}
                  options={options}
                  width={900}
                  height={300}
                />
              </div>
              <div className="chart-legend">
                {chartLegend}
              </div>
            </Card>
          </section>
        )}

        <section className="init-space">
          <div className="consumption-metrics">
            <h1>Consumption Metrics</h1>
            {isSolar && (
              <Card className="metric-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="metric-header">
                    <Image className="icon" src={icon4Src} preview={false} />
                    <h2>Solar Savings Impact</h2>
                  </div>
                  <div style={{ width: "40%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={infoCircleSrc} alt="info icon" />
                    <p style={{ fontSize: 13, color: "#515151" }}>
                      How much of your energy came from solar this month, the energy it generated, and the money you saved by not pulling it from the grid or a generator.
                    </p>
                  </div>
                </div>

                <div className="solar-hero">
                  <div className="solar-hero-block">
                    <span className="solar-hero-label">This month's savings</span>
                    <div className="solar-hero-value">
                      {formatNaira(currentMonthSavings)}
                      {previousMonthSavings > 0 && (
                        <span className={`solar-trend-badge ${savingsTrendPositive ? 'positive' : 'negative'}`}>
                          {savingsTrendPositive ? '\u2191' : '\u2193'} {Math.abs(savingsDeltaPct).toFixed(1)}% vs last month
                        </span>
                      )}
                    </div>
                    <span className="solar-hero-sub">
                      {formatEnergy(currentMonthSolarEnergy)} kWh generated &middot; {formatContribution(currentMonthContribution)} of total energy
                    </span>
                  </div>
                </div>

                <table className="solar-summary-table">
                  <thead>
                    <tr>
                      <th>Period</th>
                      <th>Solar Contribution</th>
                      <th>Energy Generated (kWh)</th>
                      <th>Estimated Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <strong>Current Month</strong>
                        <span className="solar-sub-period">{solarCurrent?.period_detail || '--'}</span>
                      </td>
                      <td>{formatContribution(solarCurrent?.contribution)}</td>
                      <td>{formatEnergy(solarCurrent?.solar_energy)}</td>
                      <td className="solar-savings-value">{formatNaira(solarCurrent?.savings)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Last Month</strong>
                        <span className="solar-sub-period">{solarPrevious?.period_detail || '--'}</span>
                      </td>
                      <td>{formatContribution(solarPrevious?.contribution)}</td>
                      <td>{formatEnergy(solarPrevious?.solar_energy)}</td>
                      <td className="solar-savings-value">{formatNaira(solarPrevious?.savings)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>This Year</strong>
                        <span className="solar-sub-period">{solarThisYear?.period_detail || '--'}</span>
                      </td>
                      <td>{formatContribution(solarThisYear?.contribution)}</td>
                      <td>{formatEnergy(solarThisYear?.solar_energy)}</td>
                      <td className="solar-savings-value">{formatNaira(solarThisYear?.savings)}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Since Commission</strong>
                        <span className="solar-sub-period">{solarSinceCommission?.period_detail || '--'}</span>
                      </td>
                      <td>{formatContribution(solarSinceCommission?.contribution)}</td>
                      <td>{formatEnergy(solarSinceCommission?.solar_energy)}</td>
                      <td className="solar-savings-value">{formatNaira(solarSinceCommission?.savings)}</td>
                    </tr>
                    <tr className="solar-highlight-row">
                      <td>
                        <strong>5-Year Projection</strong>
                        <span className="solar-sub-period">Based on current month &times; 60 months</span>
                      </td>
                      <td>---</td>
                      <td>{formatEnergy(projectionSolarEnergy5Y)}</td>
                      <td className="solar-savings-value">{formatNaira(projectionSavings5Y)}</td>
                    </tr>
                    <tr className="solar-highlight-row">
                      <td>
                        <strong>10-Year Projection</strong>
                        <span className="solar-sub-period">Based on current month &times; 120 months</span>
                      </td>
                      <td>---</td>
                      <td>{formatEnergy(projectionSolarEnergy)}</td>
                      <td className="solar-savings-value">{formatNaira(projectionSavings)}</td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            )}
            {hasBatteryDailyUsage && (
              <Card className="metric-container battery-daily-card">
                <div className="battery-daily-top">
                  <div className="metric-header">
                    <Image className="icon" src={icon4Src} preview={false} />
                    <h2>Battery Daily Usage</h2>
                  </div>
                  <div className="battery-daily-info">
                    <img src={infoCircleSrc} alt="info icon" />
                    <p>
                      Daily energy delivered by the battery, how long it discharged, and the highest state of charge it reached. Helps you spot days when the battery worked hardest or hit cycle limits.
                    </p>
                  </div>
                </div>
                <div className="battery-daily-stats">
                  <div className="battery-stat">
                    <span className="battery-stat-label">Energy delivered</span>
                    <span className="battery-stat-value">
                      {Math.round(batteryTotals.energy).toLocaleString()}
                      <span className="battery-stat-unit">kWh</span>
                    </span>
                    <span className="battery-stat-sub">{batteryDays.length} days</span>
                  </div>
                  <div className="battery-stat">
                    <span className="battery-stat-label">Avg. discharge time</span>
                    <span className="battery-stat-value">
                      {batteryAvgHours.toFixed(1)}
                      <span className="battery-stat-unit">h / day</span>
                    </span>
                    <span className="battery-stat-sub">Total {batteryTotals.hours.toFixed(1)}h</span>
                  </div>
                  <div className="battery-stat">
                    <span className="battery-stat-label">Avg. max SOC</span>
                    <span className="battery-stat-value">
                      {batteryAvgSoc.toFixed(0)}<span className="battery-stat-unit">%</span>
                    </span>
                    <span className="battery-stat-sub">Higher is better</span>
                  </div>
                </div>
                <div className="battery-daily-legend">
                  <div className="legend-item">
                    <span className="legend-square" style={{ backgroundColor: '#9640FF' }}></span>
                    <span className="legend-label">Energy provided (kWh)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-square" style={{ backgroundColor: '#4B8AFF' }}></span>
                    <span className="legend-label">Discharge duration (hours)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-line" style={{ backgroundColor: '#43D540' }}></span>
                    <span className="legend-label">Max SOC (%)</span>
                  </div>
                </div>
                <div className="battery-daily-chart">
                  <ReactChart
                    type="bar"
                    data={batteryDailyUsageData}
                    options={batteryDailyUsageOptions}
                  />
                </div>
                <div className="battery-daily-axis-labels">
                  <span>Day of {batteryDailyUsage.month || reportData.month} {batteryDailyUsage.year || reportData.year}</span>
                </div>
              </Card>
            )}
            <Card className="metric-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
                <div className="metric-header">
                  <Image className="icon" src={icon2Src} preview={false} />
                  <h2>Utility consumption</h2>
                </div>
                <div style={{ width: "40%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={infoCircleSrc} alt="info icon" />
                  <p style={{ fontSize: 13, color: "#515151" }}>
                    The chart compares your utility consumption against the energy recorded by Wyre to ensure your not overcharged.
                  </p>
                </div>
              </div>
              <Table
                pagination={false}
                columns={utilityConsumptnColumn}
                dataSource={utilityDataSource}
                rowKey="key"
              />
            </Card>

            <Card className="metric-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
                <div className="metric-header">
                  <Image className="icon" src={icon3Src} preview={false} />
                  <h2>Diesel consumption</h2>
                </div>
                <div style={{ width: "40%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={infoCircleSrc} alt="info icon" />
                  <p style={{ fontSize: 13, color: "#515151" }}>
                    The chart outlines monthly diesel usage and costs.
                    You can optimize through reduced loads, limited use during off-hours, and regular maintenance.
                  </p>
                </div>
              </div>
              <Table
                pagination={false}
                columns={dieselConsumptnColumn}
                dataSource={dieselDataSource}
                rowKey="key"
              />
            </Card>

            {!isSolar && reportData.solar_hour && (
              <Card className="metric-container solar-consumption">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
                  <div className="metric-header">
                    <Image className="icon" src={icon4Src} preview={false} />
                    <h2>Solar Hours consumption</h2>
                  </div>
                  <div style={{ width: "35%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={infoCircleSrc} alt="info icon" />
                    <p style={{ fontSize: 13, color: "#515151" }}>
                      This card shows the energy consumed during sunshine hours. The value is the potential savings if you deploy the solar solution.
                    </p>
                  </div>
                </div>
                <Table
                  showHeader={false}
                  pagination={false}
                  columns={solarHourConsumptnColumn}
                  dataSource={[
                    {
                      key: '0',
                      name: 'Energy consumed during solar hours (kWh)',
                      value: `${safeParse(reportData.solar_hour.value).toLocaleString()}${reportData.solar_hour.unit || ''}`
                    },
                    {
                      key: '1',
                      name: 'Solar percentage (% of total energy)',
                      value: `${safeParse(reportData.total_energy?.value) === 0 ? '0.0' : ((safeParse(reportData.solar_hour.value) / safeParse(reportData.total_energy.value)) * 100).toFixed(1)}%`
                    }
                  ]}
                  rowKey="key"
                  className="aligh-start-table"
                />
              </Card>
            )}
          </div>
        </section>
        <section className="init-space consumption-metrics antCard">
          <h1 className="">Operational Performance</h1>

          <Card className="power-demand-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
              <div className="metric-header">
                <Image className="icon" src={icon1Src} preview={false} />
                <h2>Power Demand</h2>
              </div>
              <div style={{ width: "45%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src={infoCircleSrc} alt="info icon" />
                <p style={{ fontSize: 13, color: "#515151" }}>
                  {isResidential
                    ? 'This chart shows the power demand during weekdays and weekends. This information, along with other factors, can be used to determine generator or solar sizing.'
                    : 'This chart shows the power demand during operational hours, non-operational hours, and weekends. This information, along with other factors, can be used to determine generator sizing.'}
                </p>
              </div>
            </div>
            <div className="chart-container">
              <Bar
                data={powerDemandData}
                options={powerDemandOptions}
              />
            </div>
            <div className="power-demand-legend">
              {isResidential ? (
                <div className="legend-group">
                  <div className="legend-group-title">Weekdays</div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#9640FF' }}></span>
                    <span className="legend-label">Max: {weekdaysData.peak} {weekdaysData.unit}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#9640FF' }}></span>
                    <span className="legend-label">Average: {weekdaysData.average} {weekdaysData.unit}</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot" style={{ backgroundColor: '#9640FF' }}></span>
                    <span className="legend-label">Min: {weekdaysData.minimum} {weekdaysData.unit}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="legend-group">
                    <div className="legend-group-title">Operational</div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: '#9640FF' }}></span>
                      <span className="legend-label">Max: {operationalData.peak} {operationalData.unit}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: '#9640FF' }}></span>
                      <span className="legend-label">Average: {operationalData.average} {operationalData.unit}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: '#9640FF' }}></span>
                      <span className="legend-label">Min: {operationalData.minimum} {operationalData.unit}</span>
                    </div>
                  </div>
                  <div className="legend-group">
                    <div className="legend-group-title">Non-operational</div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: '#F9CF40' }}></span>
                      <span className="legend-label">Max: {nonOperationalData.peak} {nonOperationalData.unit}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: '#F9CF40' }}></span>
                      <span className="legend-label">Average: {nonOperationalData.average} {nonOperationalData.unit}</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-dot" style={{ backgroundColor: '#F9CF40' }}></span>
                      <span className="legend-label">Min: {nonOperationalData.minimum} {nonOperationalData.unit}</span>
                    </div>
                  </div>
                </>
              )}
              <div className="legend-group">
                <div className="legend-group-title">Weekends</div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: '#4B8AFF' }}></span>
                  <span className="legend-label">Max: {weekendData.peak} {weekendData.unit}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: '#4B8AFF' }}></span>
                  <span className="legend-label">Average: {weekendData.average} {weekendData.unit}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: '#4B8AFF' }}></span>
                  <span className="legend-label">Min: {weekendData.minimum} {weekendData.unit}</span>
                </div>
              </div>
            </div>
          </Card>
          {!isSolar && (
            <div style={{ marginTop: "30px" }} className="metric-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    marginLeft: "30px",
                    paddingTop: "15px",
                    paddingBottom: "10px",
                  }}
                  className="icon-and-title"
                >
                  <Image className="image" src={icon6Src} />
                  <div className="icon-title">
                    <h1 style={{ fontWeight: 500 }}>Energy Usage Breakdown</h1>
                  </div>
                </div>
                <div style={{ width: "40%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={infoCircleSrc} alt="info icon" />
                  <p style={{ fontSize: 13, color: "#515151" }}>
                    The information in the card helps you plan for an alternative source of energy especially during weekends to cut cost.
                  </p>
                </div>
              </div>
              <Table pagination={false} dataSource={energy_usage_breakdown} columns={deviationUsageBreakdownColumn} className="aligh-start-table" rowKey="key" />
            </div>
          )}
          {hasDeviationData && (
            <div className="metric-container">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    marginLeft: "30px",
                    paddingTop: "15px",
                    paddingBottom: "10px",
                  }}
                  className="icon-and-title"
                >
                  <Image className="image" src={icon5Src} />

                  <div className="icon-title">
                    <h1 style={{ fontWeight: 500 }}>Deviation Energy and Cost</h1>
                  </div>
                </div>
                <div style={{ width: "40%", display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <img src={infoCircleSrc} alt="info icon" />
                  <p style={{ fontSize: 13, color: "#515151" }}>
                    The chart captures the time, energy and cost wasted by running the generator outside operating hours.
                  </p>
                </div>
              </div>
              <Table pagination={false} dataSource={deviationDataSource} columns={deviationUtitlityAndDieselColumn} rowKey="key" />
            </div>
          )}
        </section>
        <section className="init-space consumption-metrics antCard">
          {hasGeneratorSizeEfficiency && (
            <>
              <h1>Generator Size Efficiency Accuracy</h1>
              <div className="generator-efficiency ">
                <Card className="current">
                  <div>
                    <h2>{reportData.month} Month Efficiency</h2>
                    <div className="efficiency-value">
                      {generatorSizeEfficiency.current_month?.value}{generatorSizeEfficiency.current_month?.unit}
                      <span className={`change-indicator ${safeParse(generatorSizeEfficiency.current_month?.value) - safeParse(generatorSizeEfficiency.previous_month?.value) >= 0 ? 'positive' : 'negative'}`}>
                        {safeParse(generatorSizeEfficiency.current_month?.value) - safeParse(generatorSizeEfficiency.previous_month?.value) >= 0 ? '+' : '-'}
                        {Math.abs((safeParse(generatorSizeEfficiency.current_month?.value) - safeParse(generatorSizeEfficiency.previous_month?.value)).toFixed(2))}{generatorSizeEfficiency.previous_month?.unit}
                      </span>
                    </div>
                  </div>
                </Card>
                <Card className="best-ever">
                  <div>
                    <h2>Best Ever Efficiency</h2>
                    <div className="efficiency-value">
                      {generatorSizeEfficiency.best_month?.value}{generatorSizeEfficiency.best_month?.unit}
                      {generatorSizeEfficiency.best_month?.date && (
                        <div className="achieved-date">Achieved: {formatDate(generatorSizeEfficiency.best_month.date)}</div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
          {hasFuelEfficiency && (
            <Card className="metric-container">
              <h2 className="comparison-title">
                Fuel Efficiency Accuracy Comparison
                <span className="accuracy-badge">Accuracy: {fuelEfficiency.accuracy?.value}{fuelEfficiency.accuracy?.unit}</span>
              </h2>
              <Table
                pagination={false}
                columns={[
                  {
                    title: 'Recommended',
                    dataIndex: 'recommended',
                    key: 'recommended',
                  },
                  {
                    title: 'Achieved',
                    dataIndex: 'achieved',
                    key: 'achieved',
                  }
                ]}
                className="aligh-start-table"
                dataSource={fuelEfficiencyDataSource}
                rowKey="key"
              />
            </Card>
          )}
          {hasBandCategorization && (
            <div style={{ marginTop: '30px' }} className="metric-container">
              <div
                style={{
                  marginLeft: "30px",
                  paddingTop: "15px",
                  paddingBottom: "10px",
                }}
                className="icon-and-title"
              >
                <Image className="image" src={icon2Src} />
                <div className="icon-title">
                  <h1 style={{ fontWeight: 500 }}>
                    Band Categorization
                    <span className="accuracy-badge" style={{ marginLeft: "17px" }}>Band {bandCategorization[0].total_hours > 540 ? "A" : bandCategorization[0].total_hours > 432 ? "B" : bandCategorization[0].total_hours > 324 ? "C" : bandCategorization[0].total_hours > 216 ? "D" : "E"}</span></h1>
                </div>
              </div>
              <Table
                pagination={false}
                columns={bandCategorizationColumns}
                dataSource={bandCategorizationData}
                className="band-table"
                rowKey="key"
              />
            </div>
          )}
          {(hasBandCategorization || hasDataEntry) && (
            <div className="bottom-doughnut">
              {hasBandCategorization && (
                <Card className="band-category" style={{ pointerEvents: "none", opacity: 0.4, position: "relative" }}>
                  <h2>Band Categorization pie chat</h2>
                  <div className='doughnut-container' aria-disabled={true}>
                    <Doughnut
                      aria-disabled={true}
                      data={bandCategorizationPieData}
                      options={bandPieOptions}
                      plugins={[ChartDataLabels]}
                    />
                  </div>
                </Card>
              )}
              {hasDataEntry && (
                <Card className="data-entry">
                  <h2>Data Entry Score</h2>
                  <div className='doughnut-container' style={{ position: 'relative' }}>
                    <Doughnut
                      data={dataEntryScoreData}
                      options={dataEntryOptions}
                      plugins={[ChartDataLabels]}
                    />
                    <p style={{
                      position: 'absolute',
                      top: '40%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#000'
                    }}>
                      {dataEntryValue}{reportData.data_entry?.unit}
                    </p>
                  </div>
                  <p className="data-entry-subtitle">
                    Progress bar based on completeness of system inputs
                  </p>
                </Card>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
    </div>
  );

}

export default MonthlyReport;
