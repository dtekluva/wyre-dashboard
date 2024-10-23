import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { roundToDecimalPLace, 
  sumOfArrayElements } from '../../helpers/genericHelpers';

  const ScoreCardDoughnutChart = ({ data, uiSettings }) => {
    const { unit, ...extractedDataObject } = data
      ? data
      : { unit: ['Empty'], others: ['Empty'] };

    let extractedDataArray = Object.values(extractedDataObject).reverse();
    let extractedLabelsArray = Object.keys(extractedDataObject).reverse();

    const extractedBuildData = extractedDataArray.map((item, index) => 
      index === 1 ?  roundToDecimalPLace(item - extractedDataArray[0], 2) : roundToDecimalPLace(item, 2) );
      if(sumOfArrayElements(extractedBuildData) === 0){
        extractedBuildData[1] = 0.0000000000001 // hack to make the empty chart show
      }

    // Remove underscores and capitalize every word
    extractedLabelsArray = extractedLabelsArray.map((label) =>
      label
        .replace(/_/g, ' ')
        .replace(/(^\w{1})|(\s{1}\w{1})/g, (match) => match.toUpperCase())
    );
  
    const plottedData = {
      labels: extractedLabelsArray,
      datasets: [
        {
          data: extractedBuildData,
          backgroundColor: [uiSettings.appPrimaryColor, '#F0F0F0'],
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
      plugins: {
        outlabels: {
          display: false,
        },
      },
      tooltips: {
        enabled: true,
        mode: 'index',
        callbacks: {
          label: function (tooltipItem, data) {
            let valueDisplay = data['datasets'][0]['data'][tooltipItem['index']];
            if(['Forecast', 'Peak', 'Estimated Value']
              .includes(data['labels'][tooltipItem['index']])){
                valueDisplay = roundToDecimalPLace(
                  sumOfArrayElements(data['datasets'][0]['data']), 2);
            }
            return (
              data['labels'][tooltipItem['index']] +
              ': ' +
              valueDisplay +
              ' ' +
              unit
            );
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