import { Button } from 'antd';
import React, { useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import CompleteDataContext from '../../Context';
import { useNavigate } from 'react-router';

import { getLastArrayItems } from '../../helpers/genericHelpers';

const LoadOverviewPercentBarChart = ({ runningPercentageData, uiSettings, pDemand }) => {
    const history = useNavigate(); 
    const { isMediumScreen, isLessThan1296 } = useContext(CompleteDataContext);
    const options = {
        legend: {
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
                    return data['datasets'][0]['data'][tooltipItem['index']] + '%';
                },
            },
            footerFontStyle: 'normal',
            footerMarginTop: 12,
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
                        padding: 0,
                    },
                    scaleLabel: {
                        labelString: `Total Consumption (${'kWh'})`,
                        display: true,
                        padding: 10,
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
                        fontFamily: 'Montserrat',
                        fontColor: '#A3A3A3',
                        maxTicksLimit: 10,
                        padding: 0,
                        fontSize: 12,
                    },
                    scaleLabel: {
                        display: true,
                        fontColor: 'black',
                        fontSize: isMediumScreen ? 14 : 18,
                    },
                },
        },
    };


    const chartValues = runningPercentageData?.data;
    const chartlabels = runningPercentageData?.label;


    const data = {
        labels: isMediumScreen
            ? chartlabels && getLastArrayItems(chartlabels, 7)
            : isLessThan1296
                ? chartlabels && getLastArrayItems(chartlabels, 14)
                : chartlabels,
        datasets: [
            {
                maxBarThickness: 50,
                data: chartValues,
                backgroundColor:  uiSettings.appPrimaryColor,
                borderColor: '#6c00fa',
                borderWidth: 1,
            },
        ],

    };

    return (
        <div className="load-overview-bar-chart-container">
            <div className="h-flex">
                <div className="load-overview-running-time-header" style={{ display: 'flex' }}>
                    <h2 >Load Overview</h2>
                </div>
                <Button
                    className='load-overview-details__button'
                    style={{ backgroundColor: uiSettings.appPrimaryColor }}
                    type='primary'
                    pDemand={pDemand}
                    onClick={() =>{
                        return pDemand={pDemand}, 
                        history('/load-overview')
                    }
                    }
                    size='small'
                >
                    View Details
                </Button>
            </div>
            <div className="score-card-bar-chart__chart-wrapper">
                <Bar redraw data={data} options={options} />
            </div>
        </div>
    );
};

export default LoadOverviewPercentBarChart;
