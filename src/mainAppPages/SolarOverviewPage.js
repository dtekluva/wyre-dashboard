import React, { useState } from "react";
import { Card, Row, Col, Progress, Select, Table } from "antd";
import {
  ThunderboltOutlined,
  DashboardOutlined,
  CloudOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import BreadCrumb from "../components/BreadCrumb";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "/", name: "Solar Overview", id: 2 },
];

const { Option } = Select;

const SolarOverviewPage = () => {
  const [period, setPeriod] = useState("today");

  // Example data (replace with API/state data later)
  const productionPower = 2500; // kWh
  const battery = 85.3;
  const grid = 22.5;
  const usage = 517.7;

  const yieldData = [
    {
      key: "1",
      type: "Total yield",
      value: "28.4 kWh",
      price: "789,699 NGN",
    },
    {
      key: "2",
      type: "Today yield",
      value: "28.4 kWh",
      price: "5,777 NGN",
    },
    {
      key: "3",
      type: "Monthly yield",
      value: "28.4 kWh",
      price: "398,756 NGN",
    },
  ];

  // Dummy chart data
  const chartData = [
    { time: "00:00", production: 100, grid: 50, load: 70 },
    { time: "03:00", production: 200, grid: 80, load: 150 },
    { time: "06:00", production: 400, grid: 100, load: 220 },
    { time: "09:00", production: 600, grid: 120, load: 500 },
    { time: "12:00", production: 900, grid: 160, load: 700 },
    { time: "15:00", production: 700, grid: 140, load: 600 },
    { time: "18:00", production: 400, grid: 100, load: 300 },
    { time: "21:00", production: 200, grid: 80, load: 150 },
  ];

  const yieldCurve = [
    { time: "00:00", yield: 0 },
    { time: "03:00", yield: 50 },
    { time: "06:00", yield: 120 },
    { time: "09:00", yield: 200 },
    { time: "12:00", yield: 400 },
    { time: "15:00", yield: 600 },
    { time: "18:00", yield: 750 },
    { time: "21:00", yield: 800 },
  ];

  const batteryData = [
    { time: "00:00", charge: 20, discharge: 10 },
    { time: "03:00", charge: 25, discharge: 15 },
    { time: "06:00", charge: 40, discharge: 20 },
    { time: "09:00", charge: 60, discharge: 30 },
    { time: "12:00", charge: 80, discharge: 40 },
    { time: "15:00", charge: 90, discharge: 50 },
    { time: "18:00", charge: 85, discharge: 60 },
    { time: "21:00", charge: 70, discharge: 40 },
  ];

  return (
    <div className="solar-overview">
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {/* Top Cards */}
      <Row gutter={16}>
        <Col span={8}>
          <Card className="power-card">
            <h3>Power</h3>
            <Progress
              type="circle"
              percent={13}
              format={() => "13%"}
              strokeColor="#7B61FF"
            />
            <div className="power-details">
              <p>PV Production: 1.5 kW</p>
              <p>Installed Capacity: 12 MWp</p>
            </div>
          </Card>
        </Col>

        <Col span={16}>
          <Card className="flow-card">
            <div className="flow-diagram">
              <div className="circle production">
                <ThunderboltOutlined />
                <p>Production Power</p>
                <h4>{productionPower} kWh</h4>
              </div>
              <div className="circle battery">
                <DashboardOutlined />
                <p>Battery</p>
                <h4>{battery}%</h4>
              </div>
              <div className="circle grid">
                <CloudOutlined />
                <p>Grid</p>
                <h4>{grid} kWh</h4>
              </div>
              <div className="circle usage">
                <BulbOutlined />
                <p>Usage</p>
                <h4>{usage} kWh</h4>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      {/* User section */}
      <Row gutter={16} className="charts-row">
        <Col span={24}>
          <Card>
            <div className="chart-header">
              <h3>Mix, Circuit, and Balance</h3>
              <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
                <Option value="today">Today</Option>
                <Option value="week">This week</Option>
                <Option value="month">This month</Option>
              </Select>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#7B61FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="production" stroke="#f59e0b" fill="#fde68a"/>
                <Area type="monotone" dataKey="grid" stroke="#7B61FF" fillOpacity={1} fill="# url(#colorProd)" />
                <Area type="monotone" dataKey="load" stroke="#3b82f6" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      {/* Yield Section */}
      <Row gutter={16} className="charts-row">
        <Col span={24}>
          <Card>
            <h3>Yield</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={yieldCurve}>
                <defs>
                  <linearGradient id="gradientUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="yield" stroke="#f59e0b" fill="#fde68a" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>     
      </Row>

      {/* Battery Section */}
      <Row gutter={16} className="yield-row">
        <Col span={16}>
          <Card>
            <h3>Battery Storage</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={batteryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="charge" stroke="#22c55e" />
                <Area type="monotone" dataKey="discharge" stroke="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Table
              dataSource={yieldData}
              pagination={false}
              columns={[
                { title: "Type", dataIndex: "type", key: "type" },
                { title: "Value", dataIndex: "value", key: "value" },
                { title: "Price", dataIndex: "price", key: "price" },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SolarOverviewPage;