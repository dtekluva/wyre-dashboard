import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';

import path from 'path-browserify';

// import 'antd/dist/antd.css';
import './css/custom-antd.css';
import './css/style.css';
import './scss/style.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CompleteDataProvider } from './Context';
import store from './redux/store/index';

// // App-wide ChartJS settings
// import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, LineController, Title, Tooltip, Legend);


// // Remove data labels by default
// Chart.plugins.unregister(ChartDataLabels);
// // Add padding to legend
// Chart.Legend.prototype.afterFit = function () {
//   this.height = this.height + 20;
// };
// Chart.defaults.global.defaultFontFamily = "'Montserrat'";




const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <CompleteDataProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CompleteDataProvider>
  </Provider>
);