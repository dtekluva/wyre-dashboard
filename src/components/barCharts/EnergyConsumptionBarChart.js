import { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';
import { getLastArrayItems } from '../../helpers/genericHelpers';

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

const EnergyConsumptionBarChart = ({
  chartConsumptionValues = [],
  chartDeviceNames = [],
  chartDates = [],
  energyConsumptionUnit,
}) => {
  const {
    isMediumScreen,
    isLessThan1296,
    numberOfCheckedItems,
    numberOfCheckedBranches,
  } = useContext(CompleteDataContext);

  const isChartStacked =
    numberOfCheckedItems < 1 ||
    numberOfCheckedBranches > 0 ||
    numberOfCheckedItems > 3;

  const options = {
    maintainAspectRatio: false,

    layout: {
      padding: {
        left: isMediumScreen ? 5 : 25,
        right: isMediumScreen ? 20 : 50,
        top: isMediumScreen ? 20 : 25,
        bottom: isMediumScreen ? 10 : 25,
      },
    },

    plugins: {
      legend: {
        display: true,
        labels: {
          boxWidth: isMediumScreen ? 13 : 16,
          padding: isLessThan1296 ? 10 : 25,
          color: 'black',
          font: {
            size: isLessThan1296 ? 14 : 16,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
      datalabels: {
        display: false,
      },
    },

    scales: {
      y: {
        stacked: isChartStacked,
        display: true,
        grid: {
          color: '#f0f0f0',
          drawBorder: false,
          drawTicks: false,
        },
        ticks: {
          beginAtZero: true,
          padding: 10,
          maxTicksLimit: 6,
          color: '#A3A3A3',
          font: {
            size: 10,
            family: 'Roboto',
          },
        },
        title: {
          display: true,
          text: `Energy Consumption (${energyConsumptionUnit})`,
          padding: {
            top: isMediumScreen ? 10 : 25,
          },
          color: 'black',
          font: {
            size: isMediumScreen ? 14 : 18,
          },
        },
      },

      x: {
        stacked: isChartStacked,
        grid: {
          drawTicks: false,
          color: '#f0f0f0',
        },
        ticks: {
          padding: 10,
          maxTicksLimit: 10,
          maxRotation: 45,
          minRotation: 45,
          color: '#A3A3A3',
          font: {
            size: 10,
            family: 'Roboto',
          },
        },
        title: {
          display: true,
          text: 'Date and Time',
          padding: {
            top: isMediumScreen ? 10 : 25,
          },
          color: 'black',
          font: {
            size: isMediumScreen ? 14 : 18,
          },
        },
      },
    },
  };

  const colorsArray = [
    "#FF3DA1",
    "#00C7E6",
    "#5C3592",
    "#82ca9d",
    "#ff9b3d",
    "#360259",
    "#0371b5",
    "#D90000",
    "#757575",
    "#FFE11A",
  ];

  const datasets = chartDeviceNames.map((name, index) => ({
    label: name,
    maxBarThickness: 50,
    data: isMediumScreen
      ? getLastArrayItems(chartConsumptionValues[index] || [])
      : chartConsumptionValues[index] || [],
    backgroundColor: colorsArray[index % colorsArray.length],
  }));

  const data = {
    labels: isMediumScreen
      ? getLastArrayItems(chartDates, 7)
      : isLessThan1296
      ? getLastArrayItems(chartDates, 14)
      : chartDates,
    datasets,
  };

  return <Bar redraw data={data} options={options} />;
};

export default EnergyConsumptionBarChart;
