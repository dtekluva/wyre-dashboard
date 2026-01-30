import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';
import { getLastArrayItems } from '../../helpers/genericHelpers';

const VerticalLinePlugin = {
  id: 'verticalLineAcrossDataPoints',
  afterDraw(chart) {
    const tooltip = chart.tooltip;
    if (tooltip && tooltip.getActiveElements().length) {
      const ctx = chart.ctx;
      const activePoint = tooltip.getActiveElements()[0];
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#E5E5E5';
      ctx.stroke();
      ctx.restore();
    }
  },
};

const PowerDemandStackedBarChart = ({
  chartDemandValues,
  chartDeviceNames,
  chartDates,
  powerDemandUnit,
}) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const colorsArray = [
    '#6C00FA',
    '#00C7E6',
    '#FF3DA1',
    '#82ca9d',
    '#ff9b3d',
    '#360259',
    '#0371b5',
    '#D90000',
    '#757575',
    '#FFE11A',
  ];

  const datasets =
    chartDeviceNames?.map((name, index) => ({
      label: name,
      data: isMediumScreen
        ? getLastArrayItems(chartDemandValues[index])
        : chartDemandValues[index],
      backgroundColor: colorsArray[index],
      maxBarThickness: 50,
    })) || [];

  const data = {
    labels: isMediumScreen
      ? getLastArrayItems(chartDates, 7)
      : isLessThan1296
      ? getLastArrayItems(chartDates, 14)
      : chartDates,
    datasets,
  };

  const options = {
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
          font: {
            size: isLessThan1296 ? 14 : 16,
          },
          color: '#000',
          padding: isLessThan1296 ? 10 : 25,
        },
      },
      tooltip: {
        enabled: true,
        mode: 'index',
      },
      // 🔒 HARD BLOCK: no value labels, ever
      datalabels: {
        display: false,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: '#f0f0f0',
          drawTicks: false,
        },
        ticks: {
          font: { family: 'Roboto' },
          padding: 10,
          maxTicksLimit: 10,
        },
        title: {
          display: true,
          text: 'Date and Time',
          font: {
            size: isMediumScreen ? 14 : 18,
          },
          color: '#000',
          padding: isMediumScreen ? 10 : 25,
        },
      },
      y: {
        stacked: true,
        grid: {
          color: '#f0f0f0',
          drawTicks: false,
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
          maxTicksLimit: 6,
        },
        title: {
          display: true,
          text: `Demand (${powerDemandUnit})`,
          font: {
            size: isMediumScreen ? 14 : 18,
          },
          color: '#000',
          padding: isMediumScreen ? 10 : 25,
        },
      },
    },
  };

  return (
    <Bar
      data={data}
      options={options}
      plugins={[VerticalLinePlugin]}
    />
  );
};

export default PowerDemandStackedBarChart;
