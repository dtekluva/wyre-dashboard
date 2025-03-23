import React, { useContext } from 'react';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
// import ChartDataLabels from 'chartjs-plugin-piechart-outlabels';
import CompleteDataContext from '../../Context';
import { CHART_BACKGROUD_COLOR, CHART_BORDER_COLOR } from '../../helpers/constants';
import { sumOfArrayElements } from '../../helpers/genericHelpers';

const LoadConsumptionPieChart = ({ loadCunsumptionData }) => {
  const { isMediumScreen } = useContext(CompleteDataContext);


  const { label, data } = loadCunsumptionData
    ? loadCunsumptionData
    : { chartLabels: ['Empty'], data: ['Empty'] };

  const sum = sumOfArrayElements(data);
  const plottedData = {
    labels: label,
    datasets: [
      {
        data: data,
        backgroundColor: CHART_BACKGROUD_COLOR,
        borderColor: CHART_BORDER_COLOR,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    layout: {
      padding: {
        left: 20,
        right: 20,
        // top: 0,
        bottom: 70,
      },
    },
    // legend: {
    //   display: true,
    // },
    maintainAspectRatio: false,
    // plugins: {
    //   outlabels: {
    //     backgroundColor: "transparent", // Background color of Label
    //     color: 'black', // Font color
    //     stretch: 10,
    // text: function(content) {
    //     const newLineLable = content.labels[content.dataIndex].split(" ").join("\n");
    //     const v = parseFloat(content['percent']) * 100;
    //     return parseFloat(content['percent'])? `${newLineLable} \n ${v.toFixed(2).replace('.', ',')}%`: '';
    // },
    //     font: {
    //       resizable: true,
    //       minSize: isMediumScreen ?  6: 12,
    //       maxSize: isMediumScreen? 10: 18,
    //     }

    //   }
    // },
    legend: {
      display: true,
      maxWidth: 400,
      labels: {
        boxWidth: 8,
        fontSize: isMediumScreen ?  4: 8,
        fontColor: 'black',
        padding: isMediumScreen ?  3: 5,
      },
      position: 'top',
    },
    title: {
      display: false,
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      callbacks: {
        title: function (tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function (tooltipItem, data) {
          return (((data['datasets'][0]['data'][tooltipItem['index']]) / sum) * 100).toFixed(2) + '%';
        },
      },
    },
  };

  return (
    <>
      <Pie
        data={plottedData}
        options={options}
        // plugins={[ChartDataLabels]}
      />
    </>
  );
};

export default LoadConsumptionPieChart;
