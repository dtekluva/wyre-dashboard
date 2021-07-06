import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { typeOf } from 'react-responsive';
import CompleteDataContext from '../../Context';

import { getLastArrayItems } from '../../helpers/genericHelpers';
import { numberFormatter } from '../../helpers/numberFormatter';

const VerticalBar = ({ operatingTimeData, dataTitle, dataMessage }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const messageArray = dataMessage.split('(b)');

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
        label: function(tooltipItem, data){
          return data['datasets'][0]['data'][tooltipItem['index']];
        },
        
        footer: function () {
          const titleAndMessageArray = [
            dataTitle+ ': ',
            ...messageArray,
          ];
          return titleAndMessageArray;
        },
      },
      footerFontStyle: 'normal',
      footerMarginTop: 12,
    },
    
    maintainAspectRatio: false,
    scales: {
      yAxes: [
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
            labelString: 'Wastage',
            fontColor: 'black',
            fontSize: isMediumScreen ? 14 : 18,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
            fontFamily: 'Montserrat',
            fontColor: '#A3A3A3',
            maxTicksLimit: 10,
            padding: 0,
            fontSize: 12,
          },
          scaleLabel: {
            display: true,
            labelString: 'Days of the Month',
            fontColor: 'black',
            fontSize: isMediumScreen ? 14 : 18,
          },
        },
      ],
    },
  };

  const {
    chart,
    estimated_time_wasted,
    estimated_diesel_wasted,
    estimated_cost,
  } = operatingTimeData
    ? operatingTimeData
    : {
        chart: {},
        estimated_time_wasted: {},
        estimated_diesel_wasted: {},
        estimated_cost: {},
      };

  const chartValues = chart.values;
      //console.log(chartValues);
  const timeWasted =
    estimated_time_wasted.value.toFixed(2) + ' ' + estimated_time_wasted.unit;

    //console.log(timeWasted)

  const dieselWasted =
    estimated_diesel_wasted.value + ' ' + estimated_diesel_wasted.unit;

  const data = {
    labels: isMediumScreen
      ? chart.dates && getLastArrayItems(chart.dates, 7)
      : isLessThan1296
      ? chart.dates && getLastArrayItems(chart.dates, 14)
      : chart.dates,
    datasets: [
      {
        label: 'Wastage',
        maxBarThickness: 60,
        data: chartValues,
        backgroundColor: '#6c00fa',
        borderColor: '#6c00fa',
        borderWidth: 1,
      },
    ],
    
  };

  return (
    <div className="score-card-bar-chart-container">
      <div className="h-flex">
        <h2 className="score-card-heading">Operating Time</h2>
        <div className="score-card-bar-chart__text-wrapper">
          <p>
            Total Waste: <strong>{dieselWasted}</strong>
          </p>
          <p>
            Total Cost:{' '}
            <strong>{`₦ ${numberFormatter(estimated_cost.value)}`}</strong>
          </p>
          <p>
            Total Time: <strong>{timeWasted}</strong>
          </p>
        </div>
      </div>

      <div className="score-card-bar-chart__chart-wrapper">
        <Bar redraw data={data} options={options} />
      </div>
    </div>
  );
};

export default VerticalBar;
