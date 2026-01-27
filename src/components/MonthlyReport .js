import React, { useState, useEffect, useRef } from "react";
import { Image, Card, Table, Select, Spin, Button, message } from "antd";
import { useHistory, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { fetchReportData } from "../report/reportApi";
import fallbackData from "../report/newreport.json";
import {
    deviationUsageBreakdownColumn,
    deviationUtitlityAndDieselColumn,
} from "../helpers/reportTableColumns";
import "../report/report.css";

import { Doughnut } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";
import Chart from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const logoSrc = "/ReportIcons/Wyre-logo.png";
const tilderSrc = "/ReportIcons/tilder.png";
const icon1Src = "/ReportIcons/energy-icon.svg";
const icon2Src = "/ReportIcons/utility-icon.svg";
const icon3Src = "/ReportIcons/diesel-icon.svg";
const icon4Src = "/ReportIcons/solar-icon.svg";
const icon5Src = "/ReportIcons/deviation-icon.svg";
const icon6Src = "/ReportIcons/energy-usage-icon.svg";
const infoCircleSrc = "/ReportIcons/info-circle.svg";

const { Option } = Select;

function MonthlyReport({ setReportContext }) {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const history = useHistory();
    const location = useLocation();
    const sideBar = useSelector((state) => state.sideBar);

    // Get previous month and year
    const getPreviousMonth = () => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
        };
    };

    const [selectedDate, setSelectedDate] = useState(getPreviousMonth());

    const month = selectedDate.month;
    const year = selectedDate.year;


    const branchId = sideBar?.sideBarData?.branches?.[0]?.branch_id;
    console.log('branch-id === ', branchId);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    // Generate month options with disabled state for future months (excluding current month)
    const monthOptions = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ].map((option) => ({
        ...option,
        disabled: selectedDate.year === currentYear && option.value > currentMonth,
    }));

    // Generate year options with disabled state for future years
    const yearOptions = Array.from({ length: 8 }, (_, i) => {
        const year = currentYear - i;
        return {
            value: year,
            label: year.toString(),
            disabled: year > currentYear,
        };
    });

    const formatDeviceName = (name) => {
        return name.replace(/_/g, " ");
    };

    // Add a new state for loading overlay
    const [isLoadingNewReport, setIsLoadingNewReport] = useState(false);

    // Add ref for the report content
    const reportRef = useRef(null);

    // Add downloading state
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        if (!branchId || !month || !year) return;

        // this ensures SEND === PREVIEW
        if (typeof setReportContext === "function") {
            setReportContext({
                report_type: "monthly",
                branch_id: branchId,
                month,
                year,
            });
        }
    }, [branchId, month, year]);

    useEffect(() => {
        let isMounted = true;

        const loadReportData = async () => {
            // Wait for sidebar data to be loaded
            if (sideBar.fetchSideBarLoading) {
                // Don't do anything yet, just wait
                return;
            }

            if (!branchId) {
                // Only show error if sidebar is done loading and there is truly no branch
                if (!sideBar.fetchSideBarLoading) {
                    setError("No branch available. Please try again later.");
                    setLoading(false);
                    setIsLoadingNewReport(false);
                }
                return;
            }

            // If a branch is available, clear any previous error
            setError(null);

            try {
                const data = await fetchReportData(
                    branchId,
                    selectedDate.month,
                    selectedDate.year
                );
                if (isMounted) {
                    setReportData(data);
                    setError(null);
                }
            } catch (error) {
                console.error("Error loading report data:", error);
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
    }, [branchId, selectedDate, sideBar.fetchSideBarLoading]);

    // Modify the handlers to show loading state
    const handleMonthChange = (value) => {
        setIsLoadingNewReport(true);
        setSelectedDate((prev) => ({ ...prev, month: value }));
    };

    const handleYearChange = (value) => {
        setIsLoadingNewReport(true);
        setSelectedDate((prev) => ({ ...prev, year: value }));
    };

    // 1. If sidebar is still loading, show loading spinner
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

    // 2. If error, show error
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

    // 3. If report is loading, show loading spinner
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

    // 4. If no report data, show fallback
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

    // Extract numeric values from total_energy strings and handle empty/invalid values
    const operationalEnergy =
        parseInt(
            reportData.power_demand.operational.total_energy.replace(/[^\d]/g, "")
        ) || 0;
    const nonOperationalEnergy =
        parseInt(
            reportData.power_demand.non_operational.total_energy.replace(/[^\d]/g, "")
        ) || 0;
    const weekendEnergy =
        parseInt(
            reportData.power_demand.weekends.total_energy.replace(/[^\d]/g, "")
        ) || 0;

    const totalPowerDemandEnergy =
        operationalEnergy + nonOperationalEnergy + weekendEnergy;

    const energy_usage_breakdown = [
        {
            key: "1",
            name: "Operational Period",
            value: `${operationalEnergy.toLocaleString()}`,
            percentage:
                totalPowerDemandEnergy === 0
                    ? "0.0"
                    : ((operationalEnergy / totalPowerDemandEnergy) * 100).toFixed(1),
        },
        {
            key: "2",
            name: "Non-Operational Period",
            value: `${nonOperationalEnergy.toLocaleString()}`,
            percentage:
                totalPowerDemandEnergy === 0
                    ? "0.0"
                    : ((nonOperationalEnergy / totalPowerDemandEnergy) * 100).toFixed(1),
        },
        {
            key: "3",
            name: "Weekend Period",
            value: `${weekendEnergy.toLocaleString()}`,
            percentage:
                totalPowerDemandEnergy === 0
                    ? "0.0"
                    : ((weekendEnergy / totalPowerDemandEnergy) * 100).toFixed(1),
        },
    ];

    const operationalData = reportData.power_demand.operational;
    const nonOperationalData = reportData.power_demand.non_operational;
    const weekendData = reportData.power_demand.weekends;

    // Helper to safely parse numbers and avoid NaN
    const safeParse = (val, fallback = 0) => {
        const num = parseFloat(val);
        return isNaN(num) ? fallback : num;
    };

    // For energy per source and top 7 contributors chart (current month only, utility grouped, generators listed)
    const currentGenEntries =
        reportData.energy_generated?.current_month?.devices?.generator?.entries ||
        [];
    const currentUtilityEntries =
        reportData.energy_generated?.current_month?.devices?.utility || [];

    const utilityTotal = currentUtilityEntries.reduce(
        (sum, device) =>
            sum + safeParse((device.device_energy || "").split(" ")[0]),
        0
    );
    const generatorLabels = currentGenEntries.map((device) =>
        formatDeviceName(device.name)
    );
    const generatorData = currentGenEntries.map((device) =>
        safeParse((device.device_energy || "").split(" ")[0])
    );
    const generatorColors = ["#F9CF40", "#34D5FD", "#666fff", "#4B8AFF", "gray"];

    const chartLabels = ["UTILITY", ...generatorLabels];
    const chartData = [utilityTotal, ...generatorData];
    const totalSourceEnergy = chartData.reduce((sum, val) => sum + val, 0);

    const energySourceData = {
        legend: {
            display: false,
        },
        datasets: [
            {
                data: chartData.map((val) =>
                    totalSourceEnergy === 0
                        ? 0
                        : Number(((val / totalSourceEnergy) * 100).toFixed(1))
                ),
                backgroundColor: ["#9640FF", ...generatorColors],
                borderWidth: 0,
            },
        ],
    };

    // For top 7 contributors chart (current month only, utility grouped, generators listed)
    const topDevices = chartLabels
        .map((label, idx) => ({ label, value: chartData[idx] }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 7);
    const dataSource = {
        labels: topDevices.map((d) => d.label),
        datasets: [
            {
                label: "Energy (kWh)",
                data: topDevices.map((d) => d.value),
                backgroundColor: topDevices.map((d, i) =>
                    i === 0
                        ? "#9640FF"
                        : generatorColors[(i - 1) % generatorColors.length]
                ),
                borderRadius: 999,
                barThickness: 40,
                borderSkipped: false,
            },
        ],
    };

    // Update the chart legend section for new grouping
    const chartLegend = chartLabels.map((label, idx) => {
        const value = chartData[idx];
        return (
            <div className="legend-item" key={label}>
                <span
                    className="legend-dot"
                    style={{
                        backgroundColor:
                            idx === 0
                                ? "#9640FF"
                                : generatorColors[(idx - 1) % generatorColors.length],
                    }}
                ></span>
                <span className="legend-label" style={{ fontSize: 17 }}>
                    {label}: {value.toLocaleString()} kWh (
                    {totalSourceEnergy === 0
                        ? "0.0"
                        : ((value / totalSourceEnergy) * 100).toFixed(1)}
                    %)
                </span>
            </div>
        );
    });

    // Utility and diesel data sources (only 3 months)
    const utilityDataSource = [
        ...(reportData.energy_generated?.current_month?.devices?.utility || []).map(
            (device, index) => ({
                key: `current_${index}`,
                energy: safeParse(
                    (device.device_energy || "").split(" ")[0]
                ).toLocaleString(),
                time_of_use: safeParse(device.time_of_use).toLocaleString(),
                bill: safeParse(device.expected_bill).toLocaleString(),
                accuracy: safeParse(device.last_bill_accuracy).toFixed(1),
                actual_cost: safeParse(device.actual_cost).toLocaleString(),
                actual_energy: device.actual_energy || "0",
                usage_accuracy: device.usage_accuracy || "0%",
                month: device.month,
            })
        ),
        ...(
            reportData.energy_generated?.previous_month_1?.devices?.utility || []
        ).map((device, index) => ({
            key: `prev1_${index}`,
            energy: safeParse(
                (device.device_energy || "").split(" ")[0]
            ).toLocaleString(),
            time_of_use: safeParse(device.time_of_use).toLocaleString(),
            bill: safeParse(device.expected_bill).toLocaleString(),
            accuracy: safeParse(device.last_bill_accuracy).toFixed(1),
            actual_cost: safeParse(device.actual_cost).toLocaleString(),
            actual_energy: device.actual_energy || "0",
            usage_accuracy: device.usage_accuracy || "0%",
            month: device.month,
        })),
        ...(
            reportData.energy_generated?.previous_month_2?.devices?.utility || []
        ).map((device, index) => ({
            key: `prev2_${index}`,
            energy: safeParse(
                (device.device_energy || "").split(" ")[0]
            ).toLocaleString(),
            time_of_use: safeParse(device.time_of_use).toLocaleString(),
            bill: safeParse(device.expected_bill).toLocaleString(),
            accuracy: safeParse(device.last_bill_accuracy).toFixed(1),
            actual_cost: safeParse(device.actual_cost).toLocaleString(),
            actual_energy: device.actual_energy || "0",
            usage_accuracy: device.usage_accuracy || "0%",
            month: device.month,
        })),
    ];

    // Group generator entries by month for merged month cell (rowspan)
    const dieselRawEntries = [
        ...(reportData.energy_generated?.current_month?.devices?.generator
            ?.entries || []),
        ...(reportData.energy_generated?.previous_month_1?.devices?.generator
            ?.entries || []),
        ...(reportData.energy_generated?.previous_month_2?.devices?.generator
            ?.entries || []),
    ];

    // Group by month
    const monthGroups = {};
    dieselRawEntries.forEach((entry) => {
        if (!monthGroups[entry.month]) monthGroups[entry.month] = [];
        monthGroups[entry.month].push(entry);
    });

    // Prepare data for table with merged month cells
    const dieselDataSource = [];
    Object.entries(monthGroups).forEach(([month, entries]) => {
        entries.forEach((entry, idx) => {
            dieselDataSource.push({
                key: `${month}_${idx}`,
                month,
                isFirst: idx === 0,
                rowSpan: idx === 0 ? entries.length : 0,
                energy: safeParse(
                    (entry.device_energy || "").split(" ")[0]
                ).toLocaleString(),
                optimal_usage: safeParse(
                    (entry.optimal_usage || "").split(" ")[0]
                ).toLocaleString(),
                time_of_use: safeParse(entry.time_of_use).toLocaleString(),
                bill: safeParse(entry.expected_bill).toLocaleString(),
                actual_cost: safeParse(entry.actual_cost).toLocaleString(),
                optimal_cost: safeParse(entry.optimal_cost).toLocaleString(),
                accuracy: safeParse(entry.last_bill_accuracy).toFixed(2),
                name: formatDeviceName(entry.name),
            });
        });
    });

    // Define columns with rowSpan for month and smaller font for secondary rows
    const dieselConsumptnColumn = [
        {
            title: "Month",
            dataIndex: "month",
            key: "month",
            render: (text, row) => {
                const obj = {
                    children: text ? <span>{text}</span> : "",
                    props: { rowSpan: row.rowSpan },
                };
                return obj;
            },
        },
        {
            title: "Device",
            dataIndex: "name",
            key: "name",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Total Energy (kWh)",
            dataIndex: "energy",
            key: "energy",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Diesel Usage (liters)",
            dataIndex: "optimal_usage",
            key: "optimal_usage",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Optimal Usage (liters)",
            dataIndex: "optimal_usage",
            key: "optimal_usage2",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Actual Cost (Naira)",
            dataIndex: "actual_cost",
            key: "actual_cost",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Optimal Cost (Naira)",
            dataIndex: "optimal_cost",
            key: "optimal_cost",
            render: (text) => <span>{text}</span>,
        },
        {
            title: "Usage Accuracy (%)",
            dataIndex: "accuracy",
            key: "accuracy",
            render: (text) => <span>{text}</span>,
        },
    ];

    const deviationDataSource = [
        {
            key: "current",
            ...reportData.energy_deviation_and_cost.current_month,
            value: safeParse(
                reportData.energy_deviation_and_cost.current_month.value,
                0
            ).toLocaleString(),
            deviation_time_of_use: safeParse(
                reportData.energy_deviation_and_cost.current_month
                    .deviation_time_of_use,
                0
            ).toLocaleString(),
            diesel_consumption: safeParse(
                reportData.energy_deviation_and_cost.current_month.diesel_consumption,
                0
            ).toLocaleString(),
            deviation_cost: safeParse(
                reportData.energy_deviation_and_cost.current_month.deviation_cost,
                0
            ).toLocaleString(),
        },
        {
            key: "prev1",
            ...reportData.energy_deviation_and_cost.previous_month_1,
            value: safeParse(
                reportData.energy_deviation_and_cost.previous_month_1.value,
                0
            ).toLocaleString(),
            deviation_time_of_use: safeParse(
                reportData.energy_deviation_and_cost.previous_month_1
                    .deviation_time_of_use,
                0
            ).toLocaleString(),
            diesel_consumption: safeParse(
                reportData.energy_deviation_and_cost.previous_month_1
                    .diesel_consumption,
                0
            ).toLocaleString(),
            deviation_cost: safeParse(
                reportData.energy_deviation_and_cost.previous_month_1.deviation_cost,
                0
            ).toLocaleString(),
        },
        {
            key: "prev2",
            ...reportData.energy_deviation_and_cost.previous_month_2,
            value: safeParse(
                reportData.energy_deviation_and_cost.previous_month_2.value,
                0
            ).toLocaleString(),
            deviation_time_of_use: safeParse(
                reportData.energy_deviation_and_cost.previous_month_2
                    .deviation_time_of_use,
                0
            ).toLocaleString(),
            diesel_consumption: safeParse(
                reportData.energy_deviation_and_cost.previous_month_2
                    .diesel_consumption,
                0
            ).toLocaleString(),
            deviation_cost: safeParse(
                reportData.energy_deviation_and_cost.previous_month_2.deviation_cost,
                0
            ).toLocaleString(),
        },
    ];

    const formatDate = (dateString) => {
        const [month, year] = dateString.split("/");
        const date = new Date(year, month - 1);

        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            year: "numeric",
        }).format(date);
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
                position: "right",
                align: "center",
                labels: {
                    usePointStyle: false,
                    boxWidth: 26,
                    boxHeight: 9,
                    padding: 20,
                    font: {
                        size: 50,
                        weight: "550",
                    },
                    generateLabels: function (chart) {
                        const datasets = chart.data.datasets;
                        const labels = chart.data.labels;

                        return labels.map((label, i) => ({
                            text: label,
                            fillStyle: datasets[0].backgroundColor[i],
                            strokeStyle: datasets[0].backgroundColor[i],
                            lineWidth: 0,
                            borderRadius: 4,
                            hidden: false,
                            index: i,
                        }));
                    },
                },
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
                formatter: (value) => value + "%",
            },
        },
        cutout: "55%",
    };

    const options = {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 30,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            datalabels: {
                display: false,
                font: {
                    size: 20,
                    weight: "500",
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    display: false,
                },
            },
            y: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 16,
                        weight: 550,
                    },
                    color: "#66666",
                },
                afterFit: function (scaleInstance) {
                    scaleInstance.width = 140;
                },
            },
        },
        barPercentage: 0.8,
        categoryPercentage: 0.9,
    };

    const fuelEfficiencyDataSource = [
        {
            key: "1",
            recommended: `${reportData.fuel_efficiency_accuracy_comparison.recommended.value} ${reportData.fuel_efficiency_accuracy_comparison.recommended.unit}`,
            achieved: `${reportData.fuel_efficiency_accuracy_comparison.achieved.value} ${reportData.fuel_efficiency_accuracy_comparison.achieved.unit}`,
        },
    ];

    const utilityConsumptnColumn = [
        {
            title: "Month",
            dataIndex: "month",
            key: "month",
            render: (text, record) =>
                `${record.month ||
                new Date().toLocaleString("default", { month: "long" })
                }`,
        },
        {
            title: "Actual Energy (kWh)",
            dataIndex: "actual_energy",
            key: "actual_energy",
            render: (text) => text,
        },
        {
            title: "Device Energy (kWh)",
            dataIndex: "energy",
            key: "energy",
            render: (text) => text,
        },
        {
            title: "Expected Bill (Naira)",
            dataIndex: "bill",
            key: "bill",
            render: (text) => text,
        },
        {
            title: "Actual Cost (Naira)",
            dataIndex: "actual_cost",
            key: "actual_cost",
            render: (text) => text,
        },
        {
            title: "Usage Accuracy (%)",
            dataIndex: "usage_accuracy",
            key: "usage_accuracy",
            render: (text) => text,
        },
    ];

    const solarHourConsumptnColumn = [
        {
            title: "Energy consumed during solar hours (kWh)",
            dataIndex: "name",
            key: "name",
            width: "70%",
        },
        {
            title: "",
            dataIndex: "value",
            key: "value",
            width: "30%",
        },
    ];

    const powerDemandData = {
        labels: ["operational", "non-operational", "weekend hours"],
        datasets: [
            {
                label: "Min",
                data: [
                    parseFloat(reportData.power_demand.operational.minimum),
                    parseFloat(reportData.power_demand.non_operational.minimum),
                    parseFloat(reportData.power_demand.weekends.minimum),
                ],
                backgroundColor: ["#9640FF", "#F9CF40", "#4B8AFF"],
                borderRadius: 30,
                borderSkipped: false,
                maxBarThickness: 50,
                minBarLength: 2,
            },
            {
                label: "Average",
                data: [
                    parseFloat(reportData.power_demand.operational.average),
                    parseFloat(reportData.power_demand.non_operational.average),
                    parseFloat(reportData.power_demand.weekends.average),
                ],
                backgroundColor: ["#9640FF", "#F9CF40", "#4B8AFF"],
                borderRadius: 30,
                borderSkipped: false,
                maxBarThickness: 50,
                minBarLength: 2,
            },
            {
                label: "Max",
                data: [
                    parseFloat(reportData.power_demand.operational.peak),
                    parseFloat(reportData.power_demand.non_operational.peak),
                    parseFloat(reportData.power_demand.weekends.peak),
                ],
                backgroundColor: ["#9640FF", "#F9CF40", "#4B8AFF"],
                borderRadius: 30,
                borderSkipped: false,
                maxBarThickness: 50,
                minBarLength: 2,
            },
        ],
    };

    const powerDemandOptions = {
        indexAxis: "x",
        responsive: true,
        maintainAspectRatio: true,
        layout: {
            padding: {
                top: 20,
                bottom: 40,
                left: 20,
                right: 20,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                },
            },
            y: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    font: {
                        size: 14,
                    },
                },
                min: 0,
                suggestedMax: 120,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw} kWh`;
                    },
                },
            },
        },
        barPercentage: 0.9,
        categoryPercentage: 0.8,
    };

    const bandCategorizationColumns = [
        {
            title: "Band",
            dataIndex: "band",
            key: "band",
            render: (text) => <span style={{ fontSize: "20px" }}>{text}</span>,
        },
        {
            title: "Expected Hours",
            dataIndex: "expectedHours",
            key: "expectedHours",
            render: (text) => <span style={{ fontSize: "20px" }}>{text}</span>,
        },
        {
            title: "Total Hours (Achieved)",
            dataIndex: "totalHours",
            key: "totalHours",
            render: (text) => <span style={{ fontSize: "20px" }}>{text}</span>,
        },
        {
            title: "Blackout (hrs)",
            dataIndex: "deviation",
            key: "deviation",
            render: (text) => {
                const value = parseInt(text);
                return (
                    <span style={{ fontSize: "20px" }}>
                        {value < 0 ? "---" : Math.abs(text)}
                    </span>
                );
            },
        },
        {
            title: "Percentage Compliance",
            dataIndex: "compliance",
            key: "compliance",
            render: (text) => <span style={{ fontSize: "20px" }}>{text}</span>,
        },
    ];

    const bandCategorizationData = reportData.utility_band_categorization.map(
        (band, index) => ({
            key: (index + 1).toString(),
            band: band.band,
            expectedHours: `${parseInt(band.expected_hours).toLocaleString()}`,
            totalHours: `${parseInt(band.total_hours).toLocaleString()}`,
            deviation: `${parseInt(band.expected_hours) - parseInt(band.total_hours)
                }`,
            compliance: `${(
                (parseInt(band.total_hours) / parseInt(band.expected_hours)) *
                100
            ).toFixed(1)}%`,
        })
    );

    const bandCategorization = reportData.utility_band_categorization;
    const totalHours = bandCategorization.reduce(
        (acc, band) => acc + parseInt(band.total_hours),
        0
    );
    const availableHours = bandCategorization.reduce(
        (acc, band) => acc + parseInt(band.expected_hours),
        0
    );

    const bandCategorizationPieData = {
        labels: ["Total Month Hours", "Total Utility Available Hours"],
        datasets: [
            {
                data: [totalHours, availableHours],
                backgroundColor: ["#9640FF", "#F9CF40"],
                borderWidth: 0,
                spacing: 0,
                weight: 1,
                circumference: 360,
            },
        ],
    };

    const dataEntryValue = parseFloat(reportData.data_entry.value);
    const remainingValue = 100 - dataEntryValue;

    const dataEntryScoreData = {
        labels: ["Completed", "Remaining"],
        datasets: [
            {
                data: [dataEntryValue, remainingValue],
                backgroundColor: ["#9640FF", "#F0F0F0"],
                borderWidth: 0,
                spacing: 0,
                weight: 1,
                circumference: 360,
                rotation: 225,
            },
        ],
    };

    const bandPieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
            legend: {
                position: "bottom",
                align: "left",
                labels: {
                    padding: 20,
                    font: {
                        size: 14,
                        position: "left",
                        weight: "400",
                    },
                    color: "#515151",
                    usePointStyle: true,
                    pointStyle: "circle",
                },
            },
            tooltip: {
                enabled: true,
                backgroundColor: "white",
                titleColor: "#000",
                bodyColor: "#000",
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
                    },
                },
            },
            datalabels: {
                display: true,
                color: "#FFFFFF",
                font: {
                    size: 11,
                    weight: "700",
                },
                formatter: (value) => {
                    return value + "hrs";
                },
                anchor: "center",
            },
        },
    };

    const dataEntryOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "55%",
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                enabled: true,
                backgroundColor: "white",
                titleColor: "#000",
                bodyColor: "#000",
                padding: 12,
                callbacks: {
                    title: () => "Data Entry Progress",
                    label: (context) => {
                        const value = context.raw;
                        return `${value}% ${context.datasetIndex === 0 ? "Completed" : "Remaining"
                            }`;
                    },
                },
            },
            datalabels: {
                display: false,
            },
        },
    };

    const handleDownloadPdf = async () => {
        if (!reportRef.current) return;

        setDownloading(true);
        message.loading({ content: "Generating PDF...", key: "pdfDownload" });

        try {
            await new Promise((resolve) => setTimeout(resolve, 500));

            const element = reportRef.current;
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#fff",
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            });

            const imgData = canvas.toDataURL("image/png");

            // Convert px to mm
            const pxToMm = 0.264583;
            const pdfWidth = canvas.width * pxToMm;
            const pdfHeight = canvas.height * pxToMm;

            // Create a PDF with the exact size of the report
            const pdf = new jsPDF({
                orientation: pdfWidth > pdfHeight ? "landscape" : "portrait",
                unit: "mm",
                format: [pdfWidth, pdfHeight],
            });

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            const branchName = reportData?.branch_name || "branch";
            const month = reportData?.month || "";
            const year = reportData?.year || new Date().getFullYear();
            const filename = `${branchName}_${month}_energy_report_${year}.pdf`;

            pdf.save(filename);
            message.success({
                content: "PDF downloaded successfully!",
                key: "pdfDownload",
            });
        } catch (error) {
            console.error("Error generating PDF:", error);
            message.error({ content: "Failed to generate PDF", key: "pdfDownload" });
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="report-page">
            <div
                style={{
                    padding: "20px",
                    display: "flex",
                    gap: "20px",
                    float: "right",
                    alignItems: "center",
                }}
            >
                <Select
                    style={{ width: 200 }}
                    value={selectedDate.month}
                    onChange={handleMonthChange}
                    placeholder="Select Month"
                    disabled={isLoadingNewReport}
                >
                    {monthOptions.map((option) => (
                        <Option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </Option>
                    ))}
                </Select>

                <Select
                    style={{ width: 120 }}
                    value={selectedDate.year}
                    onChange={handleYearChange}
                    placeholder="Select Year"
                    disabled={isLoadingNewReport}
                >
                    {yearOptions.map((option) => (
                        <Option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </Option>
                    ))}
                </Select>
                {/* <Button
          type="primary"
          onClick={handleDownloadPdf}
          loading={downloading}
        >
          Download Report
        </Button> */}
            </div>

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
                            <div className="wyre-logo">
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
                                Monthly Energy Report for{" "}
                                <span style={{ textTransform: "capitalize" }}>
                                    {reportData.branch_name}
                                </span>{" "}
                                <br />{" "}
                                <span style={{ textTransform: "capitalize" }}>
                                    {reportData.month}
                                </span>
                                , {reportData.year}
                            </h1>
                            <p>powered by Wyre</p>
                        </div>
                    </section>
                    <section className="init-space">
                        <div className="head-card">
                            <Card className="title">
                                <div>
                                    <h1
                                        style={{
                                            fontWeight: "590",
                                            marginTop: "18px",
                                            textAlign: "center",
                                        }}
                                    >
                                        Total Energy Consumed:
                                    </h1>
                                </div>
                            </Card>
                            <Card className="value">
                                <h1 style={{ fontSize: "32Px", textAlign: "center" }}>
                                    <Image className="tilde" src={tilderSrc} preview={false} />
                                    <span
                                        className="amount"
                                        style={{ fontSize: "50px", marginLeft: "15px" }}
                                    >
                                        {Number(reportData.total_energy.value).toLocaleString()}
                                    </span>
                                    <span
                                        className="unit"
                                        style={{ fontSize: "24px", fontWeight: "400" }}
                                    >
                                        {reportData.total_energy.unit}
                                    </span>
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
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "40px",
                                    width: "100%",
                                }}
                                className="energy-source-chart"
                            >
                                {/* Doughnut chart */}
                                <div
                                    style={{
                                        width: 300,
                                        height: 300,
                                        marginBottom: "30px",
                                        position: "relative",
                                    }}
                                >
                                    <Doughnut data={energySourceData} options={doughnutOptions} />
                                </div>
                                {/* Custom legend */}
                                <div style={{ minWidth: 220 }}>
                                    {chartLabels.map((label, idx) => {
                                        const value = chartData[idx];
                                        const percent =
                                            totalSourceEnergy === 0
                                                ? "0.0"
                                                : ((value / totalSourceEnergy) * 100).toFixed(1);
                                        return (
                                            <div
                                                key={label}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    marginBottom: 16,
                                                    fontSize: 18,
                                                    gap: 10,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        display: "inline-block",
                                                        width: 25,
                                                        height: 10,
                                                        borderRadius: "5px",
                                                        background:
                                                            idx === 0
                                                                ? "#9640FF"
                                                                : generatorColors[
                                                                (idx - 1) % generatorColors.length
                                                                ],
                                                    }}
                                                ></span>
                                                <span>
                                                    <b>{label}</b>: {value.toLocaleString()} kWh{" "}
                                                    <span style={{ color: "#888" }}>({percent}%)</span>
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Card>
                    </section>
                    <section className="init-space antCard">
                        <Card className="top-contributors-card">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                    alignItems: "center",
                                }}
                            >
                                <div className="contributors-header">
                                    <Image className="icon" src={icon1Src} preview={false} />
                                    <div className="header-content">
                                        <h1>Top 7 energy contributors</h1>
                                        <div className="total-energy">
                                            {Number(reportData.total_energy.value).toLocaleString()}
                                            <span>{reportData.total_energy.unit}</span>
                                        </div>
                                    </div>
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
                                        Chart highlighting the top seven loads with the most energy
                                        consumption. This card is designed for bespoke account users
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
                            <div className="chart-legend">{chartLegend}</div>
                        </Card>
                    </section>
                    <section className="init-space">
                        <div className="consumption-metrics">
                            <h1>Consumption Metrics</h1>
                            <Card className="metric-container">
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "16px",
                                        alignItems: "center",
                                    }}
                                >
                                    <div className="metric-header">
                                        <Image className="icon" src={icon2Src} preview={false} />
                                        <h2>Utility consumption</h2>
                                    </div>
                                    <div
                                        style={{
                                            width: "40%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <img src={infoCircleSrc} alt="info icon" />
                                        <p style={{ fontSize: 13, color: "#515151" }}>
                                            The chart compares your utility consumption with the
                                            service provider to ensure that you are not overcharged.
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
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "16px",
                                        alignItems: "center",
                                    }}
                                >
                                    <div className="metric-header">
                                        <Image className="icon" src={icon3Src} preview={false} />
                                        <h2>Diesel consumption</h2>
                                    </div>
                                    <div
                                        style={{
                                            width: "40%",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                        }}
                                    >
                                        <img src={infoCircleSrc} alt="info icon" />
                                        <p style={{ fontSize: 13, color: "#515151" }}>
                                            The chart outlines monthly diesel usage and costs. You can
                                            optimize through reduced loads, limited use during
                                            off-hours, and regular maintenance.
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

                            <Card className="metric-container solar-consumption">
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "16px",
                                        alignItems: "center",
                                    }}
                                >
                                    <div className="metric-header">
                                        <Image className="icon" src={icon4Src} preview={false} />
                                        <h2>Solar Hours consumption</h2>
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
                                            This card shows the energy consumed during sunshine hours.
                                            The value is the potential savings if you deploy the solar
                                            solution.
                                        </p>
                                    </div>
                                </div>
                                <Table
                                    showHeader={false}
                                    pagination={false}
                                    columns={solarHourConsumptnColumn}
                                    dataSource={[
                                        {
                                            key: "0",
                                            name: "Energy consumed during solar hours (kWh)",
                                            value: `${reportData.solar_hour.value.toLocaleString()}${reportData.solar_hour.unit
                                                }`,
                                        },
                                        {
                                            key: "1",
                                            name: "Solar percentage (% of total energy)",
                                            value: `${(
                                                (reportData.solar_hour.value /
                                                    reportData.total_energy.value) *
                                                100
                                            ).toFixed(1)}%`,
                                        },
                                    ]}
                                    rowKey="key"
                                    className="aligh-start-table"
                                />
                            </Card>
                        </div>
                    </section>
                    <section className="init-space consumption-metrics antCard">
                        <h1 className="">Operational Performance</h1>

                        <Card className="power-demand-card">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                    alignItems: "center",
                                }}
                            >
                                <div className="metric-header">
                                    <Image className="icon" src={icon1Src} preview={false} />
                                    <h2>Power Demand</h2>
                                </div>
                                <div
                                    style={{
                                        width: "45%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <img src={infoCircleSrc} alt="info icon" />
                                    <p style={{ fontSize: 13, color: "#515151" }}>
                                        This chart shows the power demand during operational hours,
                                        non-operational hours, and weekends. This information, along
                                        with other factors, can be used to determine generator
                                        sizing.
                                    </p>
                                </div>
                            </div>
                            <div className="chart-container">
                                <Bar data={powerDemandData} options={powerDemandOptions} />
                            </div>
                            <div className="power-demand-legend">
                                <div className="legend-group">
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#9640FF" }}
                                        ></span>
                                        <span className="legend-label">
                                            Max: {operationalData.peak} {operationalData.unit}
                                        </span>
                                    </div>
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#9640FF" }}
                                        ></span>
                                        <span className="legend-label">
                                            Average: {operationalData.average} {operationalData.unit}
                                        </span>
                                    </div>
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#9640FF" }}
                                        ></span>
                                        <span className="legend-label">
                                            Min: {operationalData.minimum} {operationalData.unit}
                                        </span>
                                    </div>
                                </div>
                                <div className="legend-group">
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#F9CF40" }}
                                        ></span>
                                        <span className="legend-label">
                                            Max: {nonOperationalData.peak} {nonOperationalData.unit}
                                        </span>
                                    </div>
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#F9CF40" }}
                                        ></span>
                                        <span className="legend-label">
                                            Average: {nonOperationalData.average}{" "}
                                            {nonOperationalData.unit}
                                        </span>
                                    </div>
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#F9CF40" }}
                                        ></span>
                                        <span className="legend-label">
                                            Min: {nonOperationalData.minimum}{" "}
                                            {nonOperationalData.unit}
                                        </span>
                                    </div>
                                </div>
                                <div className="legend-group">
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#4B8AFF" }}
                                        ></span>
                                        <span className="legend-label">
                                            Max: {weekendData.peak} {weekendData.unit}
                                        </span>
                                    </div>
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#4B8AFF" }}
                                        ></span>
                                        <span className="legend-label">
                                            Average: {weekendData.average} {weekendData.unit}
                                        </span>
                                    </div>
                                    <div className="legend-item">
                                        <span
                                            className="legend-dot"
                                            style={{ backgroundColor: "#4B8AFF" }}
                                        ></span>
                                        <span className="legend-label">
                                            Min: {weekendData.minimum} {weekendData.unit}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                        <div style={{ marginTop: "30px" }} className="metric-container">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                    alignItems: "center",
                                }}
                            >
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
                                <div
                                    style={{
                                        width: "40%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <img src={infoCircleSrc} alt="info icon" />
                                    <p style={{ fontSize: 13, color: "#515151" }}>
                                        The information in the card helps you plan for an
                                        alternative source of energy especially during weekends to
                                        cut cost.
                                    </p>
                                </div>
                            </div>
                            <Table
                                pagination={false}
                                dataSource={energy_usage_breakdown}
                                columns={deviationUsageBreakdownColumn}
                                className="aligh-start-table"
                                rowKey="key"
                            />
                        </div>
                        <div className="metric-container">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    gap: "16px",
                                    alignItems: "center",
                                }}
                            >
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
                                        <h1 style={{ fontWeight: 500 }}>
                                            Deviation Energy and Cost
                                        </h1>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        width: "40%",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                    }}
                                >
                                    <img src={infoCircleSrc} alt="info icon" />
                                    <p style={{ fontSize: 13, color: "#515151" }}>
                                        The chart captures the time, energy and cost wasted by
                                        running the generator outside operating hours.
                                    </p>
                                </div>
                            </div>
                            <Table
                                pagination={false}
                                dataSource={deviationDataSource}
                                columns={deviationUtitlityAndDieselColumn}
                                rowKey="key"
                            />
                        </div>
                    </section>
                    <section className="init-space consumption-metrics antCard">
                        <h1>Generator Size Efficiency Accuracy</h1>
                        <div className="generator-efficiency ">
                            <Card className="current">
                                <div>
                                    <h2>{reportData.month} Month Efficiency</h2>
                                    <div className="efficiency-value">
                                        {reportData.generator_size_efficiency.current_month.value}
                                        {reportData.generator_size_efficiency.current_month.unit}
                                        <span
                                            className={`change-indicator ${reportData.generator_size_efficiency.current_month
                                                    .value -
                                                    reportData.generator_size_efficiency.previous_month
                                                        .value >=
                                                    0
                                                    ? "positive"
                                                    : "negative"
                                                }`}
                                        >
                                            {reportData.generator_size_efficiency.current_month
                                                .value -
                                                reportData.generator_size_efficiency.previous_month
                                                    .value >=
                                                0
                                                ? "+"
                                                : "-"}
                                            {Math.abs(
                                                (
                                                    reportData.generator_size_efficiency.current_month
                                                        .value -
                                                    reportData.generator_size_efficiency.previous_month
                                                        .value
                                                ).toFixed(2)
                                            )}
                                            {reportData.generator_size_efficiency.previous_month.unit}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                            <Card className="best-ever">
                                <div>
                                    <h2>Best Ever Efficiency</h2>
                                    <div className="efficiency-value">
                                        {reportData.generator_size_efficiency.best_month.value}
                                        {reportData.generator_size_efficiency.best_month.unit}
                                        <div className="achieved-date">
                                            Achieved:{" "}
                                            {formatDate(
                                                reportData.generator_size_efficiency.best_month.date
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                        <Card className="metric-container">
                            <h2 className="comparison-title">
                                Fuel Efficiency Accuracy Comparison
                                <span className="accuracy-badge">
                                    Accuracy:{" "}
                                    {
                                        reportData.fuel_efficiency_accuracy_comparison.accuracy
                                            .value
                                    }
                                    {reportData.fuel_efficiency_accuracy_comparison.accuracy.unit}
                                </span>
                            </h2>
                            <Table
                                pagination={false}
                                columns={[
                                    {
                                        title: "Recommended",
                                        dataIndex: "recommended",
                                        key: "recommended",
                                    },
                                    {
                                        title: "Achieved",
                                        dataIndex: "achieved",
                                        key: "achieved",
                                    },
                                ]}
                                className="aligh-start-table"
                                dataSource={fuelEfficiencyDataSource}
                                rowKey="key"
                            />
                        </Card>
                        <div style={{ marginTop: "30px" }} className="metric-container">
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
                                        <span
                                            className="accuracy-badge"
                                            style={{ marginLeft: "17px" }}
                                        >
                                            Band{" "}
                                            {bandCategorization[0].total_hours > 540
                                                ? "A"
                                                : bandCategorization[0].total_hours > 432
                                                    ? "B"
                                                    : bandCategorization[0].total_hours > 324
                                                        ? "C"
                                                        : bandCategorization[0].total_hours > 216
                                                            ? "D"
                                                            : "E"}
                                        </span>
                                    </h1>
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
                        <div className="bottom-doughnut">
                            <Card
                                className="band-category"
                                style={{
                                    pointerEvents: "none",
                                    opacity: 0.4,
                                    position: "relative",
                                }}
                            >
                                <h2>Band Categorization pie chat</h2>
                                <div className="doughnut-container" aria-disabled={true}>
                                    <Doughnut
                                        aria-disabled={true}
                                        data={bandCategorizationPieData}
                                        options={bandPieOptions}
                                    />
                                </div>
                            </Card>
                            <Card className="data-entry">
                                <h2>Data Entry Score</h2>
                                <div
                                    className="doughnut-container"
                                    style={{ position: "relative" }}
                                >
                                    <Doughnut
                                        data={dataEntryScoreData}
                                        options={dataEntryOptions}
                                    />
                                    <p
                                        style={{
                                            position: "absolute",
                                            top: "40%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontSize: "24px",
                                            fontWeight: "bold",
                                            color: "#000",
                                        }}
                                    >
                                        {dataEntryValue}
                                        {reportData.data_entry.unit}
                                    </p>
                                </div>
                                <p className="data-entry-subtitle">
                                    Progress bar based on completeness of system inputs
                                </p>
                            </Card>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default MonthlyReport;