import React, { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';
import { convertDecimalTimeToNormal } from '../../helpers/genericHelpers';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DashboardDoughnutChart = ({ data, uiSettings, sideBarData }) => {
  const { isMediumScreen, useMediaQuery } = useContext(CompleteDataContext);
  const newData = {
    devices: [],
    hours: []
  }

  const isLessThan481 = useMediaQuery({ query: '(max-width: 481px)' });
  if (data && sideBarData) {
    data.devices.forEach((deviceData, index) => {
      const findName = sideBarData.branches[0].devices.find((side) => deviceData.name.endsWith(side.name) && side.is_source);
      if (findName) {
        newData.devices.push(deviceData.name)
        newData.hours.push(deviceData.usage_hours)
      }
    })
  }


  const { devices, hours } = newData
    ? newData
    : { devices: ['Empty'], hours: ['Empty'] };
  const plottedData = {
    labels: devices,
    datasets: [
      {
        label: 'Power Usage (Hours/Month)',
        data: hours,
        backgroundColor: [
          uiSettings.appPrimaryColor,
          '#00C7E6',
          '#FF3DA1',
          '#82ca9d',
          '#ff9b3d',
          '#360259',
          '#0371b5',
          '#D90000',
          '#757575',
          '#FFE11A',
        ],
        borderColor: [
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
          '#FFFFFF',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    // cutout: '65%',
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 20,
        right: 40,
        top: 10,
        // bottom: 10,
      },
    },

    plugins: {
      title: {
        display: true,
        text: 'Power Usage (Hours/Month)',
        color: 'black',
        font: {
          size: 18,
          weight: 'normal',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },

      legend: {
        display: true,
        position: isLessThan481 ? 'top' : 'right',
        labels: {
          boxWidth: 13,
          padding: 10,
          color: 'black',
          font: {
            size: isMediumScreen ? 14 : 16,
          },
        },
      },

      tooltip: {
        enabled: true,
        callbacks: {
          title: (tooltipItems) => {
            return tooltipItems[0].label;
          },
          label: (tooltipItem) => {
            return convertDecimalTimeToNormal(tooltipItem.raw);
          },
        },
      },

      datalabels: {
        display: true,
        formatter: (value, context) => {
          const dataArr = context.chart.data.datasets[0].data;
          const sum = dataArr.reduce((a, b) => a + b, 0);
          return `${((value * 100) / sum).toFixed()}%`;
        },
        color: 'white',
        font: {
          size: isMediumScreen ? 14 : 16,
          weight: '700',
        },
      },
    },
  };

  return (
    <>
      <div style={{ height: '320px', position: 'relative' }}>
        <Doughnut data={plottedData} options={options} />
      </div>
    </>
  );
};

export default DashboardDoughnutChart;
