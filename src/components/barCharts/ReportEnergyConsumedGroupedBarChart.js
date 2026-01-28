import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import CompleteDataContext from "../../Context";

import {
  getLastArrayItems,
  convertDateStringToObject,
} from "../../helpers/genericHelpers";

const ReportEnergyConsumedGroupedBarChart = ({ data }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const chartBranchNames = data && data.map((eachBranch) => eachBranch.branch);

  const chartConsumptionValues =
    data && data.map((eachBranch) => eachBranch.values);

  const rawBranchDates =
    data &&
    data[0].dates.map((eachDate) => convertDateStringToObject(eachDate));

  const chartDates =
    rawBranchDates &&
    rawBranchDates.map((eachDate) => eachDate.format("MMM YYYY"));

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
          stacked: false,
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
            labelString: `Energy Consumption (${"kWh"})`,
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: "black",
          },
        },
      ],
      xAxes: [
        {
          stacked: false,
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
            labelString: "Date",
            padding: isMediumScreen ? 10 : 25,
            fontSize: isMediumScreen ? 14 : 18,
            fontColor: "black",
          },
        },
      ],
    },
  };

  const colorsArray = [
    "#5C3592",
    "#FF3DA1",
    "#00C7E6",
    "#82ca9d",
    "#ff9b3d",
    "#360259",
    "#0371b5",
    "#D90000",
    "#757575",
    "#FFE11A",
  ];

  const plottedDataSet =
    chartBranchNames &&
    chartBranchNames.map((_, index) => {
      return {
        maxBarThickness: 50,
        label: chartBranchNames[index],
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

export default ReportEnergyConsumedGroupedBarChart;
