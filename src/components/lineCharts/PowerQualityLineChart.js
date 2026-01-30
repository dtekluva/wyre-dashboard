import React, { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

/* ---------- register chart.js modules ---------- */
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

/* ---------- vertical hover line plugin (v4-safe) ---------- */
const VerticalLinePlugin = {
  id: 'verticalLineAcrossDataPoints',
  afterDraw(chart) {
    const tooltip = chart.tooltip;

    if (tooltip?.getActiveElements()?.length) {
      const ctx = chart.ctx;
      const activePoint = tooltip.getActiveElements()[0];
      const x = activePoint.element.x;
      const yScale = chart.scales.y;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, yScale.top);
      ctx.lineTo(x, yScale.bottom);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#E5E5E5';
      ctx.globalAlpha = 0.5;
      ctx.stroke();
      ctx.restore();
    }
  },
};

const PowerQualityLineChart = ({ data, dates, powerQualityUnit }) => {
  const { isMediumScreen, isLessThan1296 } =
    useContext(CompleteDataContext);

  const pqDataUnit = data?.units;

  /* ---------- clone + strip units ---------- */
  const pqData = data
    ? Object.fromEntries(
      Object.entries(data).filter(([key]) => key !== 'units')
    )
    : {};

  const pqDataNames = Object.keys(pqData);
  const pqDataValues = Object.values(pqData);

  const colorsArray = [
    '#6C00FA',
    '#FF3DA1',
    '#00C7E6',
    '#FFC107',
    '#82ca9d',
    '#ff9b3d',
    '#360259',
    '#0371b5',
    '#D90000',
    '#757575',
    '#FFE11A',
  ];

  // const datasets = pqDataValues.map((values, index) => ({
  //   label: `${pqDataNames[index]} (${pqDataUnit})`,
  //   data: values,
  //   borderColor: colorsArray[index % colorsArray.length],
  //   backgroundColor: colorsArray[index % colorsArray.length],
  //   borderWidth: 2,
  //   fill: false,
  //   tension: 0.3,
  //   pointRadius: 0,
  // }));

  const datasets = pqDataValues.map((values, index) => ({
    label: `${pqDataNames[index]} (${pqDataUnit})`,
    data: values,
    borderColor: colorsArray[index % colorsArray.length],
    backgroundColor: colorsArray[index % colorsArray.length],
    borderWidth: 2,
    fill: false,
    tension: 0.3,

    /* 🚫 KILL ALL VALUES / POINTS */
    pointRadius: 0,
    pointHoverRadius: 0,
    pointHitRadius: 8,
  }));

  const chartData = {
    labels: dates,
    datasets,
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
        display: true,
        labels: {
          boxWidth: isMediumScreen ? 13 : 16,
          padding: isMediumScreen ? 10 : 25,
          color: '#000',
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        intersect: false,
      },
      datalabels: {
        display: false, // 🚫 force-disable
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
        },
        ticks: {
          padding: 10,
          color: '#A3A3A3',
          maxTicksLimit: 9,
        },
        title: {
          display: true,
          text: powerQualityUnit,
          padding: isMediumScreen ? 10 : 25,
          font: {
            size: isMediumScreen ? 14 : 18,
          },
        },
      },
      x: {
        grid: {
          drawTicks: false,
          color: '#f0f0f0',
        },
        ticks: {
          color: '#A3A3A3',
          padding: 10,
          maxTicksLimit: isMediumScreen
            ? 5
            : isLessThan1296
              ? 7
              : 9,
        },
        title: {
          display: true,
          text: 'Date and Time',
          padding: isMediumScreen ? 10 : 25,
          font: {
            size: isMediumScreen ? 14 : 18,
          },
        },
      },
    },
  };

  return (
    <Line
      data={chartData}
      options={options}
      plugins={[VerticalLinePlugin]}
    />
  );
};

export default PowerQualityLineChart;
