import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const ScoreCardGenEfficiencyDoughnut = ({ data, dataTitle, dataSubtitle }) => {
  const { size, usage, unit, name } = data
    ? data
    : { size: '', usage: '', unit: '', name: '' };

  const chartLabels = ['Used', 'Unused'];
  const chartData = [usage, 100 - usage];

  const plottedData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: ['#6c00fa', '#F0F0F0'],
        borderWidth: 0,
      },
    ],
  };

  const dataSubtitleArray = dataSubtitle.split('(b)');

  const options = {
    cutoutPercentage: 60,
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    title: {
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
          return data['datasets'][0]['data'][tooltipItem['index']] + unit;
        },

        footer: function () {
          const dataTitleAndSubtitleArray = [
            dataTitle + ': ',
            ...dataSubtitleArray,
          ];
          return dataTitleAndSubtitleArray;
        },
      },
      //bodyAlign: "left",
      bodyAlign: 'left',
      footerAlign: 'left',
      titleAlign: 'left',
      xPadding: 30,
      yPadding: 30,
      footerFontStyle: 'normal',
      footerMarginTop: 12,
    },
  };

  return (
    <div className='gen-efficiency-doughnut-and-text'>
      <div className='gen-efficiency-doughnut-container'>
        <Doughnut data={plottedData} options={options} />

        <p className='gen-efficiency-doughnut-centre-text'>
          <span>
            {usage}
            {unit}
          </span>{' '}
          Used
        </p>
      </div>

      <div className='gen-efficiency-text-container'>
        <p className='gen-efficiency-device-name'>{`${name} (${size})`}</p>
        <p className='gen-efficiency-middle-text'>
          {usage}
          {unit} Load
        </p>
        <p className='h-green-text'>Good</p>
      </div>
    </div>
  );
};

export default ScoreCardGenEfficiencyDoughnut;
