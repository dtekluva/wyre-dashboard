import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const ScoreCardFuelConsumptionDoughnut = ({ data, uiSettings }) => {
  const {
    name,
    size,
    diesel_usage,
    time_used,
    fuel_efficiency,
  } = data || {
    name: '',
    size: '',
    diesel_usage: '',
    time_used: '',
    fuel_efficiency: { current_score: 0, baseline: 0 },
  };

  const chartLabels = ['Current Efficiency', 'Bench Mark'];
  const chartData = [
    fuel_efficiency.current_score,
    fuel_efficiency.baseline - fuel_efficiency.current_score,
  ];

  const plottedData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: [uiSettings.appPrimaryColor, '#F0F0F0'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: '60%',
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },

      // ✅ REMOVE ALL INNER / ARC LABELS
      datalabels: {
        display: false,
      },
      outlabels: {
        display: false,
      },

      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="fuel-consumption-doughnut-and-text">
      <div className="fuel-consumption-doughnut-container">
        <Doughnut data={plottedData} options={options} />

        <p className="fuel-consumption-doughnut-centre-text">
          <span>{fuel_efficiency.current_score}kWh/L</span>
        </p>
      </div>

      <div className="fuel-consumption-text-container">
        <p className="fuel-consumption-device-name">{`${name} (${size})`}</p>
        <p className="fuel-consumption-middle-text">{diesel_usage} Litres</p>
        <p>{time_used} hours</p>
      </div>
    </div>
  );
};

export default ScoreCardFuelConsumptionDoughnut;