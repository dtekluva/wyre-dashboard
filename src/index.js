import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
// import 'antd/dist/antd.css';
import './css/custom-antd.css';
import './css/style.css';
import './css/report.css';
import './scss/style.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CompleteDataProvider } from './Context';
import store from './redux/store/index';

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
  <Provider store={store}>
    <CompleteDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CompleteDataProvider>
  </Provider>,
  document.getElementById('root')
);
