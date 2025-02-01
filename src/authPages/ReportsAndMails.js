import React from 'react';

import { useForm } from 'react-hook-form';

import HiddenInputLabel from '../smallComponents/HiddenInputLabel';
import OutlinedInput from '../smallComponents/OutlinedInput';
import { Card, Image, Space, Table } from 'antd';

import { Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   Title,
//   Tooltip,
//   Legend,
//   ArcElement,
//   CategoryScale,
//   LinearScale
// } from 'chart.js';

// ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);
  // Data for the Pie chart
  // const data = {
  //   labels: ['Red', 'Blue', 'Yellow'], // Labels for your slices
  //   datasets: [
  //     {
  //       label: 'My Dataset',
  //       data: [300, 50, 100], // Values for each slice
  //       backgroundColor: ['red', 'blue', 'yellow'], // Slice colors
  //       borderColor: ['white', 'white', 'white'], // Border color for each slice
  //       borderWidth: 1, // Border width for slices
  //     },
  //   ],
  // };

  // const options = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     tooltip: {
  //       callbacks: {
  //         label: function (tooltipItem) {
  //           return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip
  //         },
  //       },
  //     },
  //   },
  // };

function ReportsAndMails() {

  const utilityConsumption = [
    {
      energy_consumed: {
        value: "230000",
        unit: "kWh",
      },
      time_of_use: {
        value: "230000",
        unit: "hours",
      },
      expected_bill: {
        value: "230000",
        unit: "Naira",
      },
      bill_acuracy: {
        value: "23",
        unit: "%",
      },
    },
    {
      energy_consumed: {
        value: "20000",
        unit: "kWh",
      },
      time_of_use: {
        value: "30000",
        unit: "hours",
      },
      expected_bill: {
        value: "230000",
        unit: "Naira",
      },
      bill_acuracy: {
        value: "73",
        unit: "%",
      },
    },
  ];
  const utilConsumpColumns = [
    {
      title: "Energy(kWh)",
      dataIndex: "energy_consumed",
      key: "energy_consumed",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : 0}
        </>
      ),
    },
    {
      title: "Time of Use",
      dataIndex: "time_of_use",
      key: "time_of_use",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : 0}
        </>
      ),
    },
    {
      title: "Epected Bill(#)",
      dataIndex: "expected_bill",
      key: "expected_bill",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : 0}
        </>
      ),
    },
    {
      title: "Historical bill accuracy(%)",
      dataIndex: "bill_acuracy",
      key: "bill_acuracy",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : 0}
        </>
      ),
    },
  ]

  const dataEntryScore = [
    {
      data_type: "Diesel Usage Data",
      data_entered: "80",
      weight_age: "24",
      score_contribue: "15",
    },
    {
      data_type: "Diesel Consumption Data",
      data_entered: "30",
      weight_age: "24",
      score_contribue: "15",
    },
    {
      data_type: "Utility Payment Receipts",
      data_entered: "30",
      weight_age: "24",
      score_contribue: "15",
    },
    {
      data_type: "Energy Usage Data",
      data_entered: "30",
      weight_age: "24",
      score_contribue: "15",
    },
  ];
  const dataEntryColumns = [
    {
      title: "Data type",
      dataIndex: "data_type",
      key: "data_type",
      ellipsis: true,
      // render: (data) => (
      //   <>
      //     {data
      //       ? data.value.toLocaleString(undefined, {
      //           maximumFractionDigits: 2,
      //         })
      //       : 0}
      //   </>
      // ),
    },
    {
      title: "Data Entered",
      dataIndex: "data_entered",
      key: "data_entered",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2, 
              } + '%')
            : 0}
        </>
      ),
    },
    {
      title: "Weightage",
      dataIndex: "weight_age",
      key: "weight_age",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              } + '%')
            : 0}
        </>
      ),
    },
    {
      title: "Score Contribution",
      dataIndex: "score_contribue",
      key: "score_contribue",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : 0}
        </>
      ),
    },
  ]

  const deviationReport = {
    data: [
      {
        metric: {
          value: "Energy",
          unit: "kWh",
        },
        expected: {
          value: "80",
          unit: "kWh",
        },
        deviation: {
          value: "3",
          unit: "hours",
          trend: "positive",
        },
      },
      {
        metric: {
          value: "2",
          unit: "hours/day",
        },
        expected: {
          value: "80",
          unit: "hours/day",
        },
        deviation: {
          value: "3",
          unit: "hours",
          trend: "positive",
        },
      },
      {
        metric: {
          value: "2",
          unit: "L/day",
        },
        expected: {
          value: "80",
          unit: "L/day",
        },
        deviation: {
          value: "8",
          unit: "L/day",
          trend: "positive",
        },
      },
    ],
    efficiency: [
      {
        metric: {
          value: "Energy",
          unit: "kWh",
        },
        expected: {
          value: "80",
          unit: "hours",
        },
        achieved: {
          value: "3",
          unit: "hours",
        },
        efficiency: {
          value: "3",
          unit: "%",
        },
      },
      {
        metric: {
          value: "Energy",
          unit: "kWh",
        },
        expected: {
          value: "20",
          unit: "hours",
        },
        achieved: {
          value: "13",
          unit: "hours",
        },
        efficiency: {
          value: "3",
          unit: "%",
        },
      },
      {
        metric: {
          value: "Energy",
          unit: "kWh",
        },
        expected: {
          value: "80",
          unit: "hours",
        },
        achieved: {
          value: "3",
          unit: "hours",
        },
        efficiency: {
          value: "3",
          unit: "%",
        },
      },
    ],
    capacity: {
      target: "70",
      archieved: "62",
      best_ever: "71",
    },
  };
  const deviaReportColumns = [
    {
      title: "Metric",
      dataIndex: "data_type",
      key: "data_type",
      ellipsis: true,
      // render: (data) => (
      //   <>
      //     {data
      //       ? data.value.toLocaleString(undefined, {
      //           maximumFractionDigits: 2,
      //         })
      //       : 0}
      //   </>
      // ),
    },
    {
      title: "Expected",
      dataIndex: "data_entered",
      key: "data_entered",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2, 
              } + '%')
            : 0}
        </>
      ),
    },
    {
      title: "Actual",
      dataIndex: "weight_age",
      key: "weight_age",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              } + '%')
            : 0}
        </>
      ),
    },
    {
      title: "Deviation",
      dataIndex: "score_contribue",
      key: "score_contribue",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : 0}
        </>
      ),
    },
  ]
  const d2eviaReportColumns = [
    {
      title: "Metric",
      dataIndex: "data_type",
      key: "data_type",
      ellipsis: true,
      // render: (data) => (
      //   <>
      //     {data
      //       ? data.value.toLocaleString(undefined, {
      //           maximumFractionDigits: 2,
      //         })
      //       : 0}
      //   </>
      // ),
    },
    {
      title: "Expected Hours",
      dataIndex: "data_entered",
      key: "data_entered",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2, 
              } + '%')
            : 0}
        </>
      ),
    },
    {
      title: "Achieved",
      dataIndex: "weight_age",
      key: "weight_age",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              } + '%')
            : 0}
        </>
      ),
    },
    {
      title: "Efficiency (%)",
      dataIndex: "score_contribue",
      key: "score_contribue",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })
            : 0}
        </>
      ),
    },
  ]

  const fuelEfficiency = [
    {
      metric: {
        value: "Fuel Efficiency",
        unit: "",
      },
      recommended: {
        value: "80",
        unit: "",
      },
      achieved: {
        value: "3",
        unit: "",
      },
      best_ever: {
        value: "3",
        unit: "",
      },
    },
    {
      metric: {
        value: "Diesel Usage",
        unit: "",
      },
      recommended: {
        value: "80",
        unit: "L",
      },
      achieved: {
        value: "3",
        unit: "L",
      },
      best_ever: {
        value: "3",
        unit: "L",
      },
    },
    {
      metric: {
        value: "Energy Ouput",
        unit: "",
      },
      recommended: {
        value: "80",
        unit: "kWh",
      },
      achieved: {
        value: "3",
        unit: "kWh",
      },
      best_ever: {
        value: "3",
        unit: "kWh",
      },
    },
  ];
  const fuelEffiColumns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.value
            : 0}
        </>
      ),
    },
    {
      title: "Recommended",
      dataIndex: "recommended",
      key: "recommended",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.value.toLocaleString(undefined, {
                maximumFractionDigits: 2, 
              }) + data.unit
            : 0}
        </>
      ),
    },
    {
      title: "Achieved This Month",
      dataIndex: "achieved",
      key: "achieved",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }) + data.unit
            : 0}
        </>
      ),
    },
    {
      title: "Best Ever Achieved",
      dataIndex: "best_ever",
      key: "best_ever",
      ellipsis: true,
      render: (data) => (
        <>
          {data
            ? data.value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              }) + data.unit
            : 0}
        </>
      ),
    },
  ]

  const data = {
    labels: ['Red', 'Blue', 'Yellow'], // Labels for your slices
    datasets: [
      {
        label: 'My Dataset',
        data: [300, 50, 100], // Values for each slice
        backgroundColor: ['red', 'blue', 'yellow'], // Slice colors
        borderColor: ['white', 'white', 'white'], // Border color for each slice
        borderWidth: 1, // Border width for slices
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`; // Custom tooltip
          },
        },
      },
    },
  };

  return (
    <div className="auth-page-container">
      <h1 className="contact-heading first-heading--auth">Monthly Reports</h1>
      <div className="whole-case">
        <div className="second-case">
          <div className="energy-case">
            <div className="top-card">
              <div className="left-card">
                <h1>Total Energy Consumed for December</h1>
                <div className="card-container">
                  <div className="icon-image">
                    <Image className="icon" src="/report-Icon.png" />
                  </div>
                  <p className="icon-value">45kWh</p>
                </div>
              </div>
              <div className='boundry-line'>
                <hr></hr>
              </div>
              <div className="right-card">
                <h1>Peak Power Demand during Operational hours</h1>
                <div className="card-container">
                  <div className="icon-image">
                    <Image className="icon" src="/report-Icon.png" />
                  </div>
                  <p className="icon-value">45kWh</p>
                </div>
              </div>
            </div>
          </div>
          <div className="pieChart-And-demand">
              <div className="pie-chart">
                <h4>Energy Pie Chart</h4>
                {/* <p>-------diagram-------</p>
                <p>
                  <span>Utility</span>
                  <span>Inverter</span>
                  <span>Generator</span>
                </p> */}
                {/* <Pie data={data} options={options} /> */}
              </div>
              <div className="power-demand">
                <h4>Power Demand</h4>
                <div className="demand-card">
                  <Card>
                    <p>Peak Power Demand</p>
                    <p>45 kWh</p>
                  </Card>
                  <Card>
                    <p>Average Power Demand</p>
                    
                    <p>45 kWh</p>
                  </Card>
                  <Card>
                    <p>Minimum Power Demand</p>
                    <p>45 kWh</p>
                  </Card>
                </div>
              </div>
          </div>
          <>
            <p>Utility Consumption</p>
            <Table
              dataSource={utilityConsumption}
              columns={utilConsumpColumns}
            />

            <p>Data Entry</p>
            <Table dataSource={dataEntryScore} columns={dataEntryColumns} />

            <p>Deviation Report</p>
            <Table dataSource={""} columns={deviaReportColumns} />

            <p>Deviation Report</p>
            <Space style={{ justifyItems: "space-between" }}>
              <Card>Total Capacity</Card>
              <Card>Achieved</Card>
              <Card>Best ever</Card>
            </Space>

            <p>Deviation Report</p>
            <Table dataSource={""} columns={d2eviaReportColumns} />

            <p>Fuel Efficiency Accuracy(kWh/L)</p>
            <Table dataSource={fuelEfficiency} columns={fuelEffiColumns} />
          </>
        </div>
      </div>
    </div>
  );
}

export default ReportsAndMails;
