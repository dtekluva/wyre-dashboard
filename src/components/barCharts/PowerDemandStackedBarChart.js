import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

import { getLastArrayItems } from '../../helpers/genericHelpers';

const VerticalLinePlugin = {
  id: 'verticalLineAcrossDataPoints',
  afterDatasetsDraw: function (chart) {
    if (chart.tooltip._active && chart.tooltip._active.length) {
      var activePoint = chart.tooltip._active[0],
        ctx = chart.ctx,
        y_axis = chart.scales['y-axis-0'],
        x = activePoint.tooltipPosition().x,
        topY = y_axis.top,
        bottomY = y_axis.bottom;
      // draw line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#E5E5E5';
      ctx.opacity = 0.5;
      ctx.stroke();
      ctx.restore();
    }
  },
};

const PowerDemandStackedBarChart = ({
  chartDemandValues,
  chartDeviceNames,
  chartTooltipValues,
  chartDates,
  powerDemandUnit,
}) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const options = {
    layout: {
      padding: {
        left: isMediumScreen ? 5 : 25,
        right: isMediumScreen ? 20 : 50,
        top: isMediumScreen ? 20 : 25,
        bottom: isMediumScreen ? 10 : 25,
      },
    },
    legend: {
      display: true,
      labels: {
        boxWidth: isMediumScreen ? 13 : 16,
        fontSize: isLessThan1296 ? 14 : 16,
        fontColor: 'black',
        padding: isLessThan1296 ? 10 : 25,
      },
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: 
        {
          stacked: true,
          display: true,
          gridLines: {
            color: '#f0f0f0',
            drawBorder: false,
            drawTicks: false,
            zeroLineColor: '#f0f0f0',
          },
          ticks: {
            beginAtZero: true,
            fontFamily: 'Roboto',
            padding: 10,
            maxTicksLimit: 6,
          },
          scaleLabel: {
            display: true,
            labelString: `Demand (${powerDemandUnit})`,
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: 'black',
          },
        },
      xAxes: 
        {
          ticks: {
            fontFamily: 'Roboto',
            padding: 10,
            maxTicksLimit: 10,
          },
          gridLines: {
            drawTicks: false,
            color: '#f0f0f0',
            zeroLineColor: '#f0f0f0',
          },
          stacked: true,
          scaleLabel: {
            display: true,
            labelString: 'Date and Time',
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: 'black',
          },
        },
    },
    tooltips: {
      enabled: true,
      mode: 'index',
    },
  };

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

  const plottedDataSet =
    chartDeviceNames &&
    chartDeviceNames.map((_, index) => {
      return {
        maxBarThickness: 50,
        label: chartDeviceNames[index],
        // Pick data for last week if screen is a medium screen or less
        data: isMediumScreen
          ? getLastArrayItems(chartDemandValues[index])
          : chartDemandValues[index],
        backgroundColor: colorsArray[index],
      };
    });

  const plottedData = chartDates && {
    labels: isMediumScreen
      ? getLastArrayItems(chartDates, 7)
      : isLessThan1296
      ? getLastArrayItems(chartDates, 14)
      : chartDates,
    datasets: plottedDataSet,
  };

  return (
    <>
      <Bar
        redraw
        data={plottedData || { datasets: [], labels: [] }}
        options={options}
        plugins={[VerticalLinePlugin]}
      />
    </>
  );
};

export default PowerDemandStackedBarChart;
