import React, { useContext } from 'react';
import { Line } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

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

const PowerQualityLineChart = ({ data, dates, powerQualityUnit }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);
  const pqDataUnit = data && data.units;

  const pqData = data && Object.assign({}, data);
  if (pqData) delete pqData.units;

  const pqDataValues = pqData && Object.values(pqData);
  const pqDataNames = pqData && Object.keys(pqData);
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

  const plottedDataSets =
    pqDataValues &&
    pqDataValues.map((eachDataValue, index) => {
      return {
        label: `${pqDataNames[index]} (${pqDataUnit})`,
        data: eachDataValue,
        fill: false,
        backgroundColor: colorsArray[index],
        borderColor: colorsArray[index],
        borderWidth: 2,
      };
    });

  const plottedData = {
    labels: dates,
    datasets: plottedDataSets,
  };

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
        fontSize: isMediumScreen ? 14 : 16,
        fontColor: 'black',
        padding: isMediumScreen ? 10 : 25,
      },
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
            padding: 10,
            fontColor: '#A3A3A3',
            maxTicksLimit: 9,
          },
          scaleLabel: {
            display: true,
            labelString: powerQualityUnit,
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: 'black',
          },
        },
      xAxes: 
        {
          ticks: {
            fontColor: '#A3A3A3',
            fontFamily: 'Roboto',
            padding: 10,
            maxTicksLimit: isMediumScreen ? 5 : isLessThan1296 ? 7 : 9,
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
    tooltips: {
      enabled: true,
      mode: 'index',
      callbacks: {
        title: function (tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
      },
    },
  };

  return (
    <>
      <Line
        data={plottedData}
        options={options}
        plugins={[VerticalLinePlugin]}
      />
    </>
  );
};

export default PowerQualityLineChart;
