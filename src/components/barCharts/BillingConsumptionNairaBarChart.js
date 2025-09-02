import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import CompleteDataContext from "../../Context";

import { getLastArrayItems } from "../../helpers/genericHelpers";

const BillingConsumptionNairaBarChart = ({ chartValues, chartDates }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

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
      yAxes: [
        {
          gridLines: {
            color: "#f0f0f0",
            drawBorder: false,
            drawTicks: false,
            zeroLineColor: "#f0f0f0",
          },
          ticks: {
            beginAtZero: true,
            fontFamily: "Roboto",
            fontColor: "#A3A3A3",
            maxTicksLimit: 6,
            fontSize: 10,
            padding: 10,
          },
          scaleLabel: {
            display: true,
            padding: 10,
            labelString: "Monthly Consumption (Naira)",
            fontColor: "black",
            fontSize: isMediumScreen ? 14 : 18,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            drawTicks: false,
            color: "#f0f0f0",
            zeroLineColor: "#f0f0f0",
          },
          ticks: {
            beginAtZero: true,
            fontFamily: "Roboto",
            fontColor: "#A3A3A3",
            maxTicksLimit: 10,
            padding: 10,
            fontSize: 10,
          },
          scaleLabel: {
            display: true,
            labelString: "Date and Time",
            fontColor: "black",
            fontSize: isMediumScreen ? 14 : 18,
            padding: isMediumScreen ? 10 : 25,
          },
        },
      ],
    },
  };

  const data = {
    labels: isMediumScreen
      ? chartDates && getLastArrayItems(chartDates, 7)
      : isLessThan1296
      ? chartDates && getLastArrayItems(chartDates, 14)
      : chartDates,
    datasets: [
      {
        label: "Monthly Consumption (Naira)",
        maxBarThickness: 60,
        data: chartValues,
        backgroundColor: "#5C3592",
        borderColor: "#5C3592",
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

export default BillingConsumptionNairaBarChart;
