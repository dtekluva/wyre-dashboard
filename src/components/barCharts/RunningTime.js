import React, { useContext } from "react";
import { Bar } from "react-chartjs-2";
import CompleteDataContext from "../../Context";

import {
  convertDecimalTimeToNormal,
  getLastArrayItems,
} from "../../helpers/genericHelpers";

const RunningTime = ({ runningTimeData, dataMessage }) => {
  const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);

  const options = {
    legend: {
      display: false,
    },

    tooltips: {
      enabled: true,
      mode: "index",
      callbacks: {
        title: function (tooltipItem, data) {
          return data["labels"][tooltipItem[0]["index"]];
        },
        label: function (tooltipItem, data) {
          return convertDecimalTimeToNormal(
            data["datasets"][0]["data"][tooltipItem["index"]]
          );
        },
      },
      footerFontStyle: "normal",
      footerMarginTop: 12,
    },

    maintainAspectRatio: false,
    scales: {
      yAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
            fontFamily: "Roboto",
            fontColor: "#A3A3A3",
            maxTicksLimit: 6,
            fontSize: 10,
            padding: 0,
          },
          scaleLabel: {
            display: true,
            padding: 10,
            // labelString: 'Wastage',
            fontColor: "black",
            fontSize: isMediumScreen ? 14 : 18,
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            beginAtZero: true,
            fontFamily: "Montserrat",
            fontColor: "#A3A3A3",
            maxTicksLimit: 10,
            padding: 0,
            fontSize: 12,
          },
          scaleLabel: {
            display: true,
            fontColor: "black",
            fontSize: isMediumScreen ? 14 : 18,
          },
        },
      ],
    },
  };

  const chartValues = runningTimeData?.data;
  const chartlabels = runningTimeData?.label;

  const data = {
    labels: isMediumScreen
      ? chartlabels && getLastArrayItems(chartlabels, 7)
      : isLessThan1296
      ? chartlabels && getLastArrayItems(chartlabels, 14)
      : chartlabels,
    datasets: [
      {
        maxBarThickness: 60,
        data: chartValues,
        backgroundColor: "#5C3592",
        borderColor: "#5C3592",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="score-card-bar-chart-container">
      <div className="h-flex">
        <div
          className="load-overview-running-time-header"
          style={{ display: "flex" }}
        >
          <h2 className="score-card-heading">Running Time</h2>
        </div>
      </div>
      <hr className="load-overview-header-border-line" />
      <div className="score-card-bar-chart__chart-wrapper">
        <Bar redraw data={data} options={options} />
      </div>
    </div>
  );
};

export default RunningTime;
