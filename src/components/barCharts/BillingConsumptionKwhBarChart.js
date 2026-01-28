import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import CompleteDataContext from "../../Context";

import { getLastArrayItems } from "../../helpers/genericHelpers";

const BillingConsumptionKwhBarChart = ({
  chartConsumptionValues,
  chartDeviceNames,
  chartDates,
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
    numberOfCheckedItems > 3 ||
    false;

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
      display: true,
      labels: {
        boxWidth: isMediumScreen ? 13 : 16,
        fontSize: isLessThan1296 ? 14 : 16,
        fontColor: "black",
        padding: isLessThan1296 ? 10 : 25,
      },
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          stacked: isChartStacked,
          display: true,
          gridLines: {
            color: "#f0f0f0",
            drawBorder: false,
            drawTicks: false,
            zeroLineColor: "#f0f0f0",
          },
          ticks: {
            beginAtZero: true,
            fontFamily: "Roboto",
            padding: 10,
            maxTicksLimit: 6,
            fontSize: 10,
            fontColor: "#A3A3A3",
          },
          scaleLabel: {
            display: true,
            labelString: `Monthly Consumption (kWh)`,
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: "black",
          },
        },
      ],
      xAxes: [
        {
          stacked: isChartStacked,
          ticks: {
            fontFamily: "Roboto",
            fontSize: 10,
            fontColor: "#A3A3A3",
            padding: 10,
            maxTicksLimit: 10,
          },
          gridLines: {
            drawTicks: false,
            color: "#f0f0f0",
            zeroLineColor: "#f0f0f0",
          },
          scaleLabel: {
            display: true,
            labelString: "Date and Time",
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: "black",
          },
        },
      ],
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

  const plottedDataSet =
    chartDeviceNames &&
    chartDeviceNames.map((_, index) => {
      return {
        maxBarThickness: 50,
        label: chartDeviceNames[index],
        // Pick data for last week if screen is a medium screen or less
        data: isMediumScreen
          ? getLastArrayItems(chartConsumptionValues[index])
          : chartConsumptionValues[index],
        backgroundColor: colorsArray[index],
      };
    });

  const plottedData = chartDates && {
    labels: isMediumScreen
      ? getLastArrayItems(chartDates, 7)
      : isLessThan1296
      ? getLastArrayItems(chartDates, 14)
      : chartDates,
    datasets: plottedDataSet,
  };

  /**
   * Redraw added as prop to all bar charts.
   * Prevents cannot find _meta in undefined dataset bug/error
   * https://stackoverflow.com/a/44006464/15063835
   */
  return (
    <>
      <Bar
        redraw
        data={plottedData || { datasets: [], labels: [] }}
        options={options}
      />
    </>
  );
};

export default BillingConsumptionKwhBarChart;
