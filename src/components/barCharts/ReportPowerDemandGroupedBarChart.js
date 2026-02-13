import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

import { getLastArrayItems } from '../../helpers/genericHelpers';

const ReportPowerDemandGroupedBarChart = ({ data }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const chartPeriodTypes = data && data.map((eachItem) => eachItem.period_type);
  const chartDataLabels = data && data[0].data_labels;
  const chartDemandValues = data && data.map((eachItem) => eachItem.data);

  const options = {
    layout: {
      padding: {
        left: 10,
        right: 20,
        top: 20,
        bottom: 10,
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
          stacked: false,
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
            fontSize: 10,
            fontColor: '#A3A3A3',
          },
          scaleLabel: {
            display: false,
            labelString: `Power Demand`,
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: 'black',
          },
        },
      xAxes: 
        {
          stacked: false,
          ticks: {
            fontFamily: 'Roboto',
            fontSize: 10,
            fontColor: '#A3A3A3',
            padding: 10,
            maxTicksLimit: 10,
          },
          gridLines: {
            drawTicks: false,
            color: '#f0f0f0',
            zeroLineColor: '#f0f0f0',
          },
          scaleLabel: {
            display: false,
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: 'black',
          },
        },
    },
  };

  const colorsArray = [
    '#00C7E6',
    '#FF3DA1',
    '#6C00FA',
    '#82ca9d',
    '#ff9b3d',
    '#360259',
    '#0371b5',
    '#D90000',
    '#757575',
    '#FFE11A',
  ];

  const plottedDataSet =
    chartPeriodTypes &&
    chartPeriodTypes.map((_, index) => {
      return {
        maxBarThickness: 50,
        label: chartPeriodTypes[index],
        // Pick data for last week if screen is a medium screen or less
        data: isMediumScreen
          ? getLastArrayItems(chartDemandValues[index])
          : chartDemandValues[index],
        backgroundColor: colorsArray[index],
      };
    });

  const plottedData = chartDataLabels && {
    labels: isMediumScreen
      ? getLastArrayItems(chartDataLabels, 7)
      : isLessThan1296
      ? getLastArrayItems(chartDataLabels, 14)
      : chartDataLabels,
    datasets: plottedDataSet,
  };

  return (
    <>
      <Bar
        redraw
        data={plottedData || { datasets: [], labels: [] }}
        options={options}
      />
    </>
  );
};

export default ReportPowerDemandGroupedBarChart;
