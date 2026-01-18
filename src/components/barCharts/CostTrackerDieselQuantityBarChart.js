import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

import {
  getLastArrayItems,
  convertDateStringsToObjects,
  formatParametersDatetimes,
} from '../../helpers/genericHelpers';
// import { numberFormatter } from '../../helpers/numberFormatter';


const CostTrackerDieselQuantityBarChart = ({ dieselQuantityData }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const dateStrings = dieselQuantityData && dieselQuantityData.dates;
  const dateObjects = dateStrings && convertDateStringsToObjects(dateStrings);
  const formattedDates = dateObjects && formatParametersDatetimes(dateObjects);

  const dieselQuantityValues = dieselQuantityData && dieselQuantityData.values;
  // .map(value => numberFormatter(value));
  const dieselQuantityUnit = dieselQuantityData && dieselQuantityData.units;


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
      display: false,
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: 
        {
          gridLines: {
            color: '#f0f0f0',
            drawBorder: false,
            drawTicks: false,
            zeroLineColor: '#f0f0f0',
          },
          ticks: {
            beginAtZero: true,
            fontFamily: 'Roboto',
            fontColor: '#A3A3A3',
            maxTicksLimit: 6,
            fontSize: 10,
            padding: 10,
          },
          scaleLabel: {
            display: true,
            padding: 10,
            labelString: `Quantity of Diesel Purchased (${dieselQuantityUnit})`,
            fontColor: 'black',
            fontSize: isMediumScreen ? 14 : 18,
          },
        },
      xAxes:
        {
          gridLines: {
            drawTicks: false,
            color: '#f0f0f0',
            zeroLineColor: '#f0f0f0',
          },
          ticks: {
            beginAtZero: true,
            fontFamily: 'Roboto',
            fontColor: '#A3A3A3',
            maxTicksLimit: 10,
            padding: 10,
            fontSize: 10,
          },
          scaleLabel: {
            display: true,
            labelString: 'Date of Diesel Purchased',
            fontColor: 'black',
            fontSize: isMediumScreen ? 14 : 18,
            padding: isMediumScreen ? 10 : 25,
          },
        },
    }
  };

  const data = {
    labels: isMediumScreen
      ? formattedDates && getLastArrayItems(formattedDates, 7)
      : isLessThan1296
      ? formattedDates && getLastArrayItems(formattedDates, 14)
      : formattedDates,
    datasets: [
      {
        label: `Quantity of Diesel Purchased (${dieselQuantityUnit})`,
        maxBarThickness: 60,
        data: dieselQuantityValues,
        backgroundColor: '#00C7E6',
        borderColor: '#00C7E6',
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Bar redraw data={data} options={options} />
    </>
  );
};

export default CostTrackerDieselQuantityBarChart;
