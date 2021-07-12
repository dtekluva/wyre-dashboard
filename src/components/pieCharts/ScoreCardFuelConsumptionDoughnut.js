import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const ScoreCardFuelConsumptionDoughnut = ({ data }) => {
  const {
    name,
    size,
    diesel_usage,
    time_used,
    hours_to_maintenance
  } = data
    ? data
    : {
        name: '',
        size: '',
        diesel_usage: '',
        time_used: '',
        hours_to_maintenance: {},
      };

  console.log(data)
  const chartLabels = ['Used Diesel', 'Unused Diesel'];
  const chartData = [diesel_usage, 100 - diesel_usage];

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
          return data['datasets'][0]['data'][tooltipItem['index']] + '%';
        },
      },
    },
  };

  return (
    <div className='fuel-consumption-doughnut-and-text'>
      <div className='fuel-consumption-doughnut-container'>
        <Doughnut data={plottedData} options={options} />

        <p className='fuel-consumption-doughnut-centre-text'>
          <span>{hours_to_maintenance.hours}%</span> Used
        </p>
      </div>

      <div className='fuel-consumption-text-container'>
        <p className='fuel-consumption-device-name'>{`${name.toUpperCase()} (${size.toUpperCase()})`}</p>
        <p className='fuel-consumption-middle-text'>{diesel_usage} Litres</p>
        <p>{time_used} hours</p>
      </div>
    </div>
  );
};

export default ScoreCardFuelConsumptionDoughnut;
