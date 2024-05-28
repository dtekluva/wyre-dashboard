import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getGeneratorSizeMessage } from '../../helpers/genericHelpers';

const ScoreCardGenEfficiencyDoughnut = ({ data, uiSettings, peakData }) => {

  const { size, usage, unit, name, gen_size } = data
    ? data
    : { size: '', usage: '', unit: '', name: '', gen_size: 0 };

  const colorAndMessage = getGeneratorSizeMessage(usage);
  const chartLabels = ['Used', 'Unused'];
  const chartData = [usage, 100 - usage];

  const plottedData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor:[uiSettings.appPrimaryColor, '#F0F0F0'],
        borderWidth: 0,
      },
    ],
  };


  const options = {
    cutoutPercentage: 60,
    legend: {
      display: false,
    },
    plugins: {
      outlabels: {
        display: false,
      },
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

        // footer: function () {
        //   const dataTitleAndSubtitleArray = [
        //     dataTitle + ': ',
        //     ...dataSubtitleArray,
        //   ];
        //   return dataTitleAndSubtitleArray;
        // },
      },
      //bodyAlign: "left",
      bodyAlign: 'left',
      footerAlign: 'left',
      titleAlign: 'left',
      xPadding: 10,
      yPadding: 10,
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
        <p style={{ color: getGeneratorSizeMessage(usage).color }} >{getGeneratorSizeMessage(usage).message}</p>
      </div>
    </div>
  );
};

export default ScoreCardGenEfficiencyDoughnut;
