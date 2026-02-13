import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

import {
  getLastArrayItems,
  convertDateStringsToObjects,
  formatParametersDatetimes,
} from '../../helpers/genericHelpers';
// import { numberFormatter } from '../../helpers/numberFormatter';


const CostTrackerConsumptionGroupedBarChart = ({ consumptionData }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const {
    branchName,
    dates: dateStrings,
    units: unit,
    ...actualData
  } = consumptionData
    ? consumptionData
    : { branchName: '', dates: [], units: '' };

  const dateObjects = dateStrings && convertDateStringsToObjects(dateStrings);
  const formattedDates = dateObjects && formatParametersDatetimes(dateObjects);

  const consumptionValues = actualData && Object.values(actualData);
  // map(arr => 
  //   arr.map(value => numberFormatter(value))
  // );
  const deviceNames = actualData && Object.keys(actualData);


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
            display: true,
            labelString: `Quantity of Diesel Consumed (${unit})`,
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: 'black',
          },
        },
      xAxes:
        {
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
            display: true,
            labelString: 'Date and Time',
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: 'black',
          },
        },
    },
  };

  const colorsArray = [
    '#FF3DA1',
    '#00C7E6',
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
    deviceNames &&
    deviceNames.map((_, index) => {
      return {
        maxBarThickness: 50,
        label: deviceNames[index],
        // Pick data for last week if screen is a medium screen or less
        data: isMediumScreen
          ? getLastArrayItems(consumptionValues[index])
          : consumptionValues[index],
        backgroundColor: colorsArray[index],
      };
    });

  const plottedData = formattedDates && {
    labels: isMediumScreen
      ? getLastArrayItems(formattedDates, 7)
      : isLessThan1296
      ? getLastArrayItems(formattedDates, 14)
      : formattedDates,
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

export default CostTrackerConsumptionGroupedBarChart;
