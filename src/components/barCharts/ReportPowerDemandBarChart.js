import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

import {
  getLastArrayItems,
  convertDateStringToObject,
} from '../../helpers/genericHelpers';

const VerticalBar = ({ data: rawData }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const { dates, values: chartValues } = rawData || { dates: [], values: [] };

  const dateObjects =
    dates && dates.map((eachDate) => convertDateStringToObject(eachDate));

  const chartDates =
    dateObjects && dateObjects.map((eachDate) => eachDate.format('MMM DD'));

  const options = {
    layout: {
      padding: {
        left: isMediumScreen ? 20 : 50,
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
            display: false,
            padding: 10,
            labelString: '',
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
            labelString: 'Days of the Month',
            fontColor: 'black',
            fontSize: isMediumScreen ? 14 : 18,
          },
        },
    },
  };

  const data = {
    labels: isMediumScreen
      ? chartDates && getLastArrayItems(chartDates, 7)
      : isLessThan1296
      ? chartDates && getLastArrayItems(chartDates, 14)
      : chartDates,
    datasets: [
      {
        label: 'Power Demand',
        maxBarThickness: 60,
        data: chartValues,
        backgroundColor: '#6c00fa',
        borderColor: '#6c00fa',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="score-card-bar-chart__chart-wrapper">
      <Bar redraw data={data} options={options} />
    </div>
  );
};

export default VerticalBar;
