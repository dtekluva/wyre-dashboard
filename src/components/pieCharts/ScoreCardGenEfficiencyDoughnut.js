import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getGeneratorSizeMessage } from '../../helpers/genericHelpers';

const ScoreCardGenEfficiencyDoughnut = ({ data, uiSettings, peakData }) => {

  const { size, usage, unit, name, gen_size } = data
    ? data
    : { size: '', usage: '', unit: '', name: '', gen_size: 0 };

  const colorAndMessage = getGeneratorSizeMessage(usage);

  // const percentageUsage = (peakData?.peak / gen_size) * 100;
  const percentageUsage = usage;
  // const roundedUsage = percentageUsage.toFixed(2);
  const roundedUsage = percentageUsage
  const chartLabels = ['Used', 'Unused'];
  const chartData = [roundedUsage, 100 - roundedUsage];

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
            {roundedUsage}
            {unit}
          </span>{' '}
          Used
        </p>
      </div>

      <div className='gen-efficiency-text-container'>
        <p className='gen-efficiency-device-name'>{`${name} (${size})`}</p>
        <p className='gen-efficiency-middle-text'>
          {roundedUsage}
          {unit} Load
        </p>
        <p style={{ color: getGeneratorSizeMessage(roundedUsage).color }} >{getGeneratorSizeMessage(roundedUsage).message}</p>
      </div>
    </div>
  );
};

export default ScoreCardGenEfficiencyDoughnut;
