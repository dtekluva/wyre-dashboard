import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';

import CompleteDataContext from '../../Context';

import { getLastArrayItems } from '../../helpers/genericHelpers';

const ReportDailyConsumptionBar = ({ dailyConsumptionData, dataMessage }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const labels = [];
  const values = [];
  dailyConsumptionData.map((item) => {
    labels.push(item.datetime.substring(0, 2));
    values.push(item.diesel_consumed);
  });

  const options = {
    legend: {
      display: false,
    },

    tooltips: {
      enabled: true,
      mode: 'index',
      callbacks: {
        title: function (tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function (tooltipItem, data) {
          return data['datasets'][0]['data'][tooltipItem['index']];
        },
      },
      footerFontStyle: 'normal',
      footerMarginTop: 12,
    },

    maintainAspectRatio: false,
    scales: {
      yAxes: 
        {
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
            fontFamily: 'Roboto',
            fontColor: '#A3A3A3',
            maxTicksLimit: 6,
            fontSize: 10,
            padding: 0,
          },
          scaleLabel: {
            display: true,
            padding: 10,
            labelString: 'Qty of Diesel Consumed',
            fontColor: 'black',
            fontSize: isMediumScreen ? 8 : 10,
          },
        },
      xAxes: 
        {
          barPercentage: 1,
          categoryPercentage: 1,
          gridLines: {
            display: true,
          },
          ticks: {
            beginAtZero: true,
            fontFamily: 'Montserrat',
            fontColor: '#A3A3A3',
            maxTicksLimit: 10,
            padding: 0,
            fontSize: 12,
            autoSkip: false,
          },
          scaleLabel: {
            display: true,
            labelString: 'Days of the Month',
            fontColor: 'black',
            fontSize: isMediumScreen ? 10 : 14,
          },
        },
    },
  };

  const data = {
    labels: isMediumScreen
      ? labels && getLastArrayItems(labels, 7)
      : isLessThan1296
        ? labels && getLastArrayItems(labels, 14)
        : labels,
    datasets: [
      {
        label: 'Quantity of Diesel Consumed',
        maxBarThickness: 20,
        data: values,
        backgroundColor: '#00C7E6',
        borderColor: '#00C7E6',
        borderWidth: 0.2,
      },
    ],

  };

  return (
    <div className="score-card-bar-chart-container">
      <div className="report-bar-chart__chart-wrapper">
        <Bar redraw data={data} options={options} />
      </div>
    </div>
  );
};

export default ReportDailyConsumptionBar;
