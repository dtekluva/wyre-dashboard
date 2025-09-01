import React, { useContext } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import CompleteDataContext from '../../Context';
import { convertDecimalTimeToNormal } from '../../helpers/genericHelpers';

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
    layout: {
      padding: {
        left: 20,
        right: 20,
        top: 10,
        bottom: 80,
      },
    },
    legend: {
      display: true,
      labels: {
        boxWidth: 13,
        fontSize: isMediumScreen ? 14 : 16,
        fontColor: 'black',
        padding: 10,
      },
      position: isLessThan481 ? 'top' : 'right',
    },
    maintainAspectRatio: false,
    plugins: {
      outlabels: {
        display: false,
      },
      datalabels: {
        formatter: (value, context) => {
          let sum = 0;
          let dataArr = context.chart.data.datasets[0].data;
          dataArr.forEach((data) => {
            sum += data;
          });
          let percentage = ((value * 100) / sum).toFixed() + '%';
          return percentage;
        },
        color: 'white',
        font: {
          size: isMediumScreen ? 14 : 16,
          weight: '700',
        },
      },
    },
    title: {
      display: true,
      text: 'Power Usage (Hours/Month)',
      fontSize: 18,
      fontStyle: 'normal',
      fontColor: 'black',
      padding: 10,
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      callbacks: {
        title: function (tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function (tooltipItem, data) {
          return convertDecimalTimeToNormal(data['datasets'][0]['data'][tooltipItem['index']]);
        },
      },
    },
  };

  return (
    <>
      <Doughnut
        data={plottedData}
        options={options}
        plugins={[ChartDataLabels]}
      />
    </>
  );
};

export default DashboardDoughnutChart;
