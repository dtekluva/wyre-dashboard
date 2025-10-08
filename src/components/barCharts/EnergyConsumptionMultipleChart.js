import React, { useContext, useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

const EnergyConsumptionMultipleChart = ({ energyData = [], uiSettings }) => {

  const { isMediumScreen } = useContext(CompleteDataContext);
  const [forcastedData, setForcastedData] = useState(false);
  const [usedData, setUsedData] = useState(false);
  const { appPrimaryColor } = uiSettings;

  const combineSameData = (dateArray) => {
    let forcastedData = {};
    let usedData = {};
    if (dateArray.length > 0) {
      dateArray.map((data) => {
        if (forcastedData[data.date] != null) {
          forcastedData[data.date] = Number(data.forecast) + forcastedData[data.date];
        } else {
          forcastedData[data.date] = Number(data.forecast);
        }
        if (usedData[data.date] != null) {
          usedData[data.date] = usedData[data.date] + Number(data.used);
        } else {
          usedData[data.date] = Number(data.used);
        }

      })
    }
    return { forcastedData, usedData };
  }
  const sort = (data) => data.sort((a, b) => new Date(a.date) - new Date(b.date));
  const convertToOjectAndSort = (obj, name) => {
    const data = Object.entries(obj).map(([key, value]) => ({ date: key, [name]: value.toFixed(2) }));

    const sortedData = sort(data);
    const mapped = sortedData.map(item => ({ [item.date]: Number(item[name]).toFixed(2) }));
    return Object.assign({}, ...mapped);
  }
  useEffect(() => {
    const { forcastedData: forcast, usedData: used } = combineSameData(energyData);
    setForcastedData(forcast);
    setUsedData(used);

  }, [energyData]);


  const options = {
    layout: {
      padding: {
        left: isMediumScreen ? 5 : 25,
        right: isMediumScreen ? 20 : 50,
        top: isMediumScreen ? 20 : 25,
        bottom: isMediumScreen ? 10 : 25,
      },
    },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: 
        {
          gridLines: {
            color: '#f0f0f0',
            drawBorder: false,
            drawTicks: false,
            zeroLineColor: '#f0f0f0',
          },
          ticks: {
            beginAtZero: true,
            fontFamily: 'Roboto',
            fontColor: '#A3A3A3',
            maxTicksLimit: 6,
            fontSize: 10,
            padding: 10,
          },
          scaleLabel: {
            display: true,
            padding: 10,
            labelString: `Consumption (Kw)`,
            fontColor: 'black',
            fontSize: isMediumScreen ? 14 : 18,
          },
        },
      xAxes: 
        {
          gridLines: {
            drawTicks: false,
            color: '#f0f0f0',
            zeroLineColor: '#f0f0f0',
          },
          ticks: {
            beginAtZero: true,
            fontFamily: 'Roboto',
            fontColor: '#A3A3A3',
            maxTicksLimit: 10,
            padding: 10,
            fontSize: 10,
          },
          scaleLabel: {
            display: true,
            labelString: 'Months of the Year',
            fontColor: 'black',
            fontSize: isMediumScreen ? 14 : 18,
            padding: isMediumScreen ? 10 : 25,
          },
        },
    },
  };

  const data = {
    labels: Object.keys(convertToOjectAndSort(usedData, 'used')),
    datasets: [
      {
        type: 'line',
        label: `Forecasted`,
        data: Object.values(convertToOjectAndSort(forcastedData, 'forcasted')),
        backgroundColor: '#FFC205',
        borderColor: '#FFC205',
        borderWidth: 3,
        fill: false,
        tension: 0
      },
      {
        type: 'bar',
        label: `Consumption (Kw)`,
        maxBarThickness: 60,
        data: Object.values(convertToOjectAndSort(usedData, 'used')),
        backgroundColor: appPrimaryColor,
        borderColor: appPrimaryColor,
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Bar redraw data={data} options={options} />
    </>
  );
};

export default EnergyConsumptionMultipleChart;
