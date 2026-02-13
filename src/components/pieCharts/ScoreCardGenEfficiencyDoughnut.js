import React from "react";
import { Doughnut } from "react-chartjs-2";
import { getGeneratorSizeMessage } from "../../helpers/genericHelpers";

const ScoreCardGenEfficiencyDoughnut = ({ data, uiSettings }) => {
  const { size, usage, unit, name } = data || {
    size: "",
    usage: 0,
    unit: "",
    name: "",
  };

  const chartLabels = ["Used", "Unused"];
  const chartData = [usage, Math.max(0, 100 - usage)];

  const plottedData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: [
          uiSettings.appPrimaryColor,
          "#F0F0F0",
        ],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout: "60%",
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        callbacks: {
          title: (context) => context[0]?.label || "",
          label: (context) => `${context.parsed}${unit}`,
        },
        padding: 10,
        bodyAlign: "left",
        titleAlign: "left",
        footerAlign: "left",
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

  return (
    <div className="gen-efficiency-doughnut-and-text">
      <div className="gen-efficiency-doughnut-container">
        <Doughnut data={plottedData} options={options} />

        <p className="gen-efficiency-doughnut-centre-text">
          <span>
            {usage}
            {unit}
          </span>{" "}
          Used
        </p>
      </div>

      <div className="gen-efficiency-text-container">
        <p className="gen-efficiency-device-name">
          {`${name} (${size})`}
        </p>
        <p className="gen-efficiency-middle-text">
          {usage}
          {unit} Load
        </p>
        <p
          style={{
            color: getGeneratorSizeMessage(usage).color,
          }}
        >
          {getGeneratorSizeMessage(usage).message}
        </p>
      </div>
    </div>
  );
};

export default ScoreCardGenEfficiencyDoughnut;