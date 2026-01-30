import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import CompleteDataContext from "../../Context";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const EnergyConsumptionMultipleChart = ({ energyData = [], uiSettings }) => {
  const { isMediumScreen } = useContext(CompleteDataContext);
  const { appPrimaryColor } = uiSettings || {};

  const [forecastedData, setForecastedData] = useState({});
  const [usedData, setUsedData] = useState({});

  const combineSameData = (dataArray = []) => {
    const forecasted = {};
    const used = {};

    dataArray.forEach((item) => {
      if (!item?.date) return;

      forecasted[item.date] =
        (forecasted[item.date] || 0) + Number(item.forecast || 0);

      used[item.date] =
        (used[item.date] || 0) + Number(item.used || 0);
    });

    return { forecasted, used };
  };

  const sortByDate = (obj = {}) =>
    Object.entries(obj)
      .map(([date, value]) => ({ date, value }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

  useEffect(() => {
    const { forecasted, used } = combineSameData(energyData);
    setForecastedData(forecasted);
    setUsedData(used);
  }, [energyData]);

  const labels = useMemo(
    () => sortByDate(usedData).map((i) => i.date),
    [usedData]
  );

  const usedValues = useMemo(
    () => sortByDate(usedData).map((i) => Number(i.value.toFixed(2))),
    [usedData]
  );

  const forecastedValues = useMemo(
    () =>
      sortByDate(forecastedData).map((i) =>
        Number(i.value.toFixed(2))
      ),
    [forecastedData]
  );

  const data = {
    labels,
    datasets: [
      {
        type: "line",
        label: "Forecasted",
        data: forecastedValues,
        borderColor: "#FFC205",
        backgroundColor: "#FFC205",
        borderWidth: 3,
        tension: 0,
        fill: false,
        pointRadius: 3,
      },
      {
        type: "bar",
        label: "Consumption (Kw)",
        data: usedValues,
        backgroundColor: appPrimaryColor || "#4f46e5",
        borderColor: appPrimaryColor || "#4f46e5",
        borderWidth: 1,
        maxBarThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: isMediumScreen ? 5 : 25,
        right: isMediumScreen ? 20 : 50,
        top: isMediumScreen ? 20 : 25,
        bottom: isMediumScreen ? 10 : 25,
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
      datalabels: {
        display: false, // 👈 THIS removes inner labels
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#f0f0f0",
          drawBorder: false,
        },
        ticks: {
          maxTicksLimit: 6,
          color: "#A3A3A3",
          padding: 10,
          font: {
            size: 10,
          },
        },
        title: {
          display: true,
          text: "Consumption (Kw)",
          font: {
            size: isMediumScreen ? 14 : 18,
          },
        },
      },
      x: {
        grid: {
          color: "#f0f0f0",
        },
        ticks: {
          maxTicksLimit: 10,
          color: "#A3A3A3",
          padding: 10,
          font: {
            size: 10,
          },
        },
        title: {
          display: true,
          text: "Months of the Year",
          font: {
            size: isMediumScreen ? 14 : 18,
          },
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default EnergyConsumptionMultipleChart;