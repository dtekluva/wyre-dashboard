import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

import {
  getLastArrayItems,
  convertDateStringsToObjects,
  formatParametersDates,
} from '../../helpers/genericHelpers';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const DashboardStackedBarChart = ({ data, uiSettings, sideBarData }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const newData = {}

  if (data && sideBarData) {
    const { dates: dateStrings } = data ? data : { dates: [] };
    newData.dates = dateStrings;
    data && data.devices.forEach((deviceData, index) => {
      const findName = sideBarData.branches[0]?.devices.find((side) => deviceData?.name.endsWith(side?.name) && side?.is_source);
      if (findName) {
        newData[deviceData.name] = deviceData.daily_kwh;
      }
    })
  }

  const options = {
    tooltips: {
      enabled: true,
      mode: 'index',
      callbacks: {
        title: function (tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function (tooltipItem, data) {
          return Number(tooltipItem.value).toFixed(2) || 0;
        },
      },
      footerFontStyle: 'normal',
      footerMarginTop: 12,
    },
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
        padding: isLessThan1296 ? 10 : 25,
      },
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: true,
        display: true,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
          maxTicksLimit: 6,
        },
        title: {
          display: true,
          text: 'Energy - Kilowatt (kW)/Hour',
          padding: isMediumScreen ? 10 : 25,
          font: {
            size: isMediumScreen ? 14 : 18,
          },
          color: 'black',
        },
      },
      x: {
        stacked: true,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
        },
        ticks: {
          padding: 10,
          maxTicksLimit: 10,
        },
        title: {
          display: true,
          text: 'Days of the month',
          padding: isMediumScreen ? 10 : 45,
          font: {
            size: isMediumScreen ? 14 : 18,
          },
          color: 'black',
        },
      },
    },
  };

  // ensure total(organization data) is removed from initial render
  // if (data) {
  //   delete data[organization];
  // }

  // Destructure data conditionally
  const { dates: dateStrings, ...values } = newData ? newData : { dates: [] };

  const dateObjects = dateStrings && convertDateStringsToObjects(dateStrings);
  const formattedDates = dateObjects && formatParametersDates(dateObjects);

  const dataNames = Object.keys(values);
  const dataValues = Object.values(values);

  const colorsArray = [
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
  ];

  const plottedDataSet = dataNames.map((_, index) => {
    return {
      maxBarThickness: 50,
      label: dataNames[index],
      // Pick data for last week if screen is a medium screen or less
      data: isMediumScreen
        ? getLastArrayItems(dataValues[index])
        : dataValues[index],
      backgroundColor: colorsArray[index],
    };
  });

  const plottedData = {
    labels: isMediumScreen
      ? getLastArrayItems(formattedDates, 7)
      : isLessThan1296
        ? getLastArrayItems(formattedDates, 14)
        : formattedDates,
    datasets: plottedDataSet,
  };

  return (
    <>
      <Bar data={plottedData} options={options} />
    </>
  );
};

export default DashboardStackedBarChart;
