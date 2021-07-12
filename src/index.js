import React from 'react';
import ReactDOM from 'react-dom';
// import 'antd/dist/antd.css';
import './css/custom-antd.css';
import './css/style.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CompleteDataProvider } from './Context';

// App-wide ChartJS settings
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Chart from 'chart.js';
// Remove data labels by default
Chart.plugins.unregister(ChartDataLabels);
// Add padding to legend
Chart.Legend.prototype.afterFit = function () {
  this.height = this.height + 20;
};
Chart.defaults.global.defaultFontFamily = "'Montserrat'";

ReactDOM.render(
  <CompleteDataProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </CompleteDataProvider>,
  document.getElementById('root')
);
