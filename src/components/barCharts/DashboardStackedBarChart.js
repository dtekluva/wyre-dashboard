import { useContext } from 'react';
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

  const newData = {};

  if (data && sideBarData) {
    const { dates: dateStrings } = data ?? { dates: [] };
    newData.dates = dateStrings;

    data.devices.forEach((deviceData) => {
      const findName = sideBarData.branches[0]?.devices.find(
        (side) =>
          deviceData?.name.endsWith(side?.name) && side?.is_source
      );

      if (findName) {
        newData[deviceData.name] = deviceData.daily_kwh;
      }
    });
  }

  /* ================= OPTIONS ================= */
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    layout: {
      padding: {
        left: isMediumScreen ? 5 : 25,
        right: isMediumScreen ? 20 : 50,
        top: isMediumScreen ? 20 : 25,
        bottom: isMediumScreen ? 10 : 25,
      },
    },

    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
        },
        ticks: {
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
          maxRotation: 45,   // ✅ DATE SLANT
          minRotation: 45,
          autoSkip: true,
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

    plugins: {
      /* ✅ LEGEND (v3 syntax) */
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 14,           // ✅ reduced width
          boxHeight: 12,
          padding: 8,             // ✅ reduced spacing
          color: 'black',
          font: {
            size: isMediumScreen ? 12 : 14,
          },
        },
      },

      /* ✅ TOOLTIP (v3 syntax) */
      tooltip: {
        enabled: true,
        mode: 'index',
        callbacks: {
          title: (items) => items[0]?.label,
          label: (item) =>
            `${Number(item.raw).toFixed(2) || 0}`,
        },
      },
      datalabels: {
        display: false,
      },

    },
  };

  /* ================= DATA ================= */
  const { dates: dateStrings, ...values } = newData ?? { dates: [] };

  const dateObjects =
    dateStrings && convertDateStringsToObjects(dateStrings);
  const formattedDates =
    dateObjects && formatParametersDates(dateObjects);

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

  const plottedDataSet = dataNames.map((_, index) => ({
    maxBarThickness: 50,
    label: dataNames[index],
    data: isMediumScreen
      ? getLastArrayItems(dataValues[index])
      : dataValues[index],
    backgroundColor: colorsArray[index],
  }));

  const plottedData = {
    labels: isMediumScreen
      ? getLastArrayItems(formattedDates, 7)
      : isLessThan1296
        ? getLastArrayItems(formattedDates, 14)
        : formattedDates,
    datasets: plottedDataSet,
  };

  return <Bar data={plottedData} options={options} />;
};

export default DashboardStackedBarChart;
