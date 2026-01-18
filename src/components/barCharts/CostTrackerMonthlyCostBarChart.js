import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';

import dayjs from 'dayjs';

const CostTrackerMonthlyCostBarChart = ({ DieselData, utilityData, uiSettings }) => {
  const { isMediumScreen } = useContext(CompleteDataContext);
  const { appPrimaryColor } = uiSettings;

  let formattedDataForDiesel = {}
  let formattedUtilData = {}





  // NOTE; Change this implmentation as it mutates the endpoint data
  // Can be a major cause of untracable bugs
  // eslint-disable-next-line array-callback-return
  const getDieselData = DieselData?.map((e) => {

    // temporaty fix for the data mutation
    const dData = { ...e };

    // The data here is changing for all the cost tracker data
    // Separate this implementation ASAP
    const turnDateStringToWord = dayjs(e.date).format('DD-MMM-YYYY')
    e.date = turnDateStringToWord


    const turnDateStringToWordH = dayjs(dData.date).format('MMM-YYYY')
    dData.date = turnDateStringToWordH

    const dates = dData.date
    const amount = dData.price_per_litre

    if (Object.keys(formattedDataForDiesel).includes(dData.date)) {
      [formattedDataForDiesel].map((d) => {
        d[dData.date] += amount
      })
    }
    else {
      formattedDataForDiesel = { ...formattedDataForDiesel, [dates]: amount }
    }
  })

  // NOTE; Change this implmentation as it mutates the endpoint data
  // Can be a major cause of untracable bugs
  // eslint-disable-next-line array-callback-return
  const getUtilityData = utilityData?.map(e => {

    // temporaty fix for the data mutation
    const dData = { ...e };

    // The data here is changing for all the cost tracker data
    // Separate this implementation ASAP
    const turnDateStringToWord = dayjs(e.date).format('DD-MMM-YYYY')
    e.date = turnDateStringToWord


    const turnDateStringToWordH = dayjs(dData.date).format('MMM-YYYY')
    dData.date = turnDateStringToWordH

    const dates = dData.date
    const amount = dData.amount

    if (Object.keys(formattedUtilData).includes(dData.date)) {
      // eslint-disable-next-line array-callback-return
      [formattedDataForDiesel].map((d) => {
        d[dData.date] += amount
      })
    }
    else {
      formattedUtilData = { ...formattedUtilData, [dates]: amount }
    }
  })

  let chartsData = {}

  for (const key in formattedUtilData) {
    if (Object.keys(formattedDataForDiesel).includes(key)) {
      if (isNaN(formattedDataForDiesel[key])) {
        formattedDataForDiesel[key] = 0
      }
      formattedDataForDiesel[key] += formattedUtilData[key]
      chartsData = formattedDataForDiesel
    }
    else {
      formattedDataForDiesel = { ...formattedDataForDiesel, [key]: formattedUtilData[key] }
      chartsData = formattedDataForDiesel
    }
  }
  const convertToOjectAndSort = (obj) => {
    const data = Object.entries(obj).map(([key, value]) => ({ date: key, amount: value }));
    const sortedData = data.sort((a, b) => new Date(a.date) - new Date(b.date));
    const mapped = sortedData.map(item => ({ [item.date]: Number(item.amount).toFixed(2) }));

    return Object.assign({}, ...mapped);
  }

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
            labelString: `Amount in Naira`,
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
    labels: Object.keys(convertToOjectAndSort(chartsData)),
    datasets: [
      {
        label: `Amount in Naira`,
        maxBarThickness: 60,
        data: Object.values(convertToOjectAndSort(chartsData)),
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

export default CostTrackerMonthlyCostBarChart;
