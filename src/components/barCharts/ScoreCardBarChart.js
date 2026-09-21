import { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Tooltip } from 'antd';
import CompleteDataContext from '../../Context';

import {
  convertDecimalTimeToNormal,
  getLastArrayItems,
} from '../../helpers/genericHelpers';
import { numberFormatter } from '../../helpers/numberFormatter';
import InformationIcon from '../../icons/InformationIcon';

const ScoreCardBarChart = ({
  operatingTimeData,
  dataTitle,
  dataMessage,
  uiSettings,
}) => {
  const { isMediumScreen, isLessThan1296 } =
    useContext(CompleteDataContext);

  const {
    chart,
    estimated_time_wasted,
    estimated_energy_wasted,
  } = operatingTimeData || {
    chart: {},
    estimated_time_wasted: { value: 0 },
    estimated_energy_wasted: { total: 0 },
  };

  const chartValues = chart.values || [];
  const chartWastedEnergy = chart.energy_wasted || [];

  const timeWasted = estimated_time_wasted.value.toFixed(2);
  const estimatedEnergyWasted =
    estimated_energy_wasted.total.toFixed(2);

  const data = {
    labels: isMediumScreen
      ? chart.dates && getLastArrayItems(chart.dates, 7)
      : isLessThan1296
      ? chart.dates && getLastArrayItems(chart.dates, 14)
      : chart.dates,
    datasets: [
      {
        label: "Wastage",
        maxBarThickness: 60,
        data: chartValues,
        backgroundColor: uiSettings.appPrimaryColor,
        borderWidth: 0,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: 'index',
        callbacks: {
          title: (context) => context[0]?.label || '',
          label: (context) =>
            `${convertDecimalTimeToNormal(context.parsed.y)} (${chartWastedEnergy[context.dataIndex]} kWh)`,
        },
      },
      datalabels: {
        display: false,
      },
      outlabels: {
        display: false,
      },
    },

    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 6,
          font: {
            size: 10,
            family: 'montserrat',
          },
          color: '#A3A3A3',
        },
        title: {
          display: true,
          text: 'Wastage (hrs)',
          color: 'black',
          font: {
            size: isMediumScreen ? 14 : 18,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
            family: 'Montserrat',
          },
          color: '#A3A3A3',
        },
        title: {
          display: true,
          text: 'Days of the Month',
          color: 'black',
          font: {
            size: isMediumScreen ? 14 : 18,
          },
        },
      },
    },
  };

  return (
    <div className="score-card-bar-chart-container">
      <div className="h-flex">
        <div style={{ display: 'flex' }}>
          <h2 className="score-card-heading">
            Operating Time Deviation
          </h2>
          <Tooltip
            placement="top"
            popupStyle={{ whiteSpace: 'pre-line' }}
            title={dataMessage}
          >
            <p>
              <InformationIcon className="info-icon" />
            </p>
          </Tooltip>
        </div>

        <div className="score-card-bar-chart__text-wrapper">
          <p>
            Total Time:{' '}
            <strong>
              {convertDecimalTimeToNormal(timeWasted)}
            </strong>
          </p>
          <p>
            Total Energy Wasted:{' '}
            <strong>
              {numberFormatter(estimatedEnergyWasted)} kWh
            </strong>
          </p>
        </div>
      </div>

      <div className="score-card-bar-chart__chart-wrapper">
        <Bar redraw data={data} options={options} />
      </div>
    </div>
  );
};

export default ScoreCardBarChart;
