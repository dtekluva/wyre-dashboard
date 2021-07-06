import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const ScoreCardDoughnutChart = ({ data, dataTitle, dataSubtitle }) => {
  const { unit, ...extractedDataObject } = data
    ? data
    : { unit: ['Empty'], others: ['Empty'] };

  const extractedDataArray = Object.values(extractedDataObject).reverse();
  let extractedLabelsArray = Object.keys(extractedDataObject).reverse();
  


  // Remove underscores and capitalize every word
  extractedLabelsArray = extractedLabelsArray.map((label) =>
    label
      .replace(/_/g, ' ')
      .replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
  );

  // Split long data subtitle into array components to create line breaks in tooltip
  // (b) used to signify 'break'
  const dataSubtitleArray = dataSubtitle.split('(b)');

  const plottedData = {
    labels: extractedLabelsArray,
    datasets: [
      {
        data: extractedDataArray,
        backgroundColor: ['#6c00fa', '#F0F0F0'],
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutoutPercentage: 55,
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    },
    legend: {
      display: false,
    },
    maintainAspectRatio: false,
    title: {
      display: false,
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      callbacks: {
        label: function (tooltipItem, data) {
          return (
            data['labels'][tooltipItem['index']] +
            ': ' +
            data['datasets'][0]['data'][tooltipItem['index']] +
            ' ' +
            unit
          );
        },

        footer: function () {
          const dataTitleAndSubtitleArray = [
            dataTitle + ': ',
            ...dataSubtitleArray,
          ];
          return dataTitleAndSubtitleArray;
        },
      },
      xPadding: 10,
      yPadding: 10,
      footerFontStyle: 'normal',
      footerMarginTop: 12,
    },
  };

  return (
    <>
      <Doughnut data={plottedData} options={options} />
    </>
  );
};

export default ScoreCardDoughnutChart;
