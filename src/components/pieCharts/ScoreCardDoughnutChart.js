import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  roundToDecimalPLace,
  sumOfArrayElements,
} from "../../helpers/genericHelpers";

const ScoreCardDoughnutChart = ({ data, uiSettings }) => {
  const { unit, ...extractedDataObject } = data
    ? data
    : { unit: ["Empty"], others: ["Empty"] };

  let extractedDataArray = Object.values(extractedDataObject).reverse();
  let extractedLabelsArray = Object.keys(extractedDataObject).reverse();

  const extractedBuildData = extractedDataArray.map((item, index) =>
    index === 1
      ? roundToDecimalPLace(item - extractedDataArray[0], 2)
      : roundToDecimalPLace(item, 2)
  );

  // hack to make empty chart show
  if (sumOfArrayElements(extractedBuildData) === 0) {
    extractedBuildData[1] = 0.0000000000001;
  }

  // Remove underscores and capitalize words
  extractedLabelsArray = extractedLabelsArray.map((label) =>
    label
      .replace(/_/g, " ")
      .replace(/(^\w{1})|(\s{1}\w{1})/g, (match) =>
        match.toUpperCase()
      )
  );

  const plottedData = {
    labels: extractedLabelsArray,
    datasets: [
      {
        data: extractedBuildData,
        backgroundColor: [
          uiSettings.appPrimaryColor,
          "#F0F0F0",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "55%", // ✅ replaces cutoutPercentage
    maintainAspectRatio: false,
    layout: {
      padding: 0,
    },
    plugins: {
      legend: {
        display: false, // ✅ legend removed (v3/v4)
      },
      tooltip: {
        enabled: true,
        mode: "index",
        callbacks: {
          label: function (context) {
            const { dataIndex, chart } = context;
            let valueDisplay =
              chart.data.datasets[0].data[dataIndex];

            if (
              ["Forecast", "Peak", "Estimated Value"].includes(
                chart.data.labels[dataIndex]
              )
            ) {
              valueDisplay = roundToDecimalPLace(
                sumOfArrayElements(
                  chart.data.datasets[0].data
                ),
                2
              );
            }

            return (
              chart.data.labels[dataIndex] +
              ": " +
              valueDisplay +
              " " +
              unit
            );
          },
        },
        padding: 10,
      },
      // ✅ KILL ALL INNER / ARC LABELS
      datalabels: {
        display: false,
      },
      outlabels: {
        display: false,
      },
    },
  };

  return <Doughnut data={plottedData} options={options} />;
};

export default ScoreCardDoughnutChart;