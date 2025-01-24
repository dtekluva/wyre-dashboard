import React, { useEffect, useContext, useState } from 'react';
import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';
import Loader from '../components/Loader';


import RunningTime from '../components/barCharts/RunningTime';
import LoadConsumptionPieChart from '../components/pieCharts/LoadConsumptionPieChart';
import LoadOverviewDataTable from '../components/tables/LoadOverviewDataTable';
import {
  generateLoadCosumptionChartData,
  generateRunningTimeChartData,
  generateSumLoadConsumption,
  generateSumOfIsSource,
  refineLoadOverviewData,
  calculatePercentageTwoDecimal
} from '../helpers/genericHelpers';
import { numberFormatter } from '../helpers/numberFormatter';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Load Overview', id: 2 },
];


function LoadOverview({ match }) {
  const {
    setCurrentUrl,
    isAuthenticatedDataLoading,
    allCheckedOrSelectedDevice
  } = useContext(CompleteDataContext);

  const [allIsLoadDeviceData, setAllisLoadDeviceData] = useState(false);
  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    if (allCheckedOrSelectedDevice) {
      const data = refineLoadOverviewData(allCheckedOrSelectedDevice);
      setAllisLoadDeviceData(Object.values(data));
    }

  }, [allCheckedOrSelectedDevice]);


  const TotalCard = ({ title, data }) => (
    <div className='load-overview-total-card'>
      <div className='load-overview-total-content'>
        <h4>{title}</h4>
        <p >{data}</p>
      </div>
    </div>
  );


  if (isAuthenticatedDataLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {
        allIsLoadDeviceData && allIsLoadDeviceData.length > 0 ? allIsLoadDeviceData.map((branch) =>
        (<div key={branch[0].branchName}>
          <article className='score-card-row-3'>
            <h2> {branch[0].branchName} </h2>
            <hr />
          </article>
          <article className='score-card-row-3'>
            <div className='load-overview-total-cards-container' >
              <TotalCard title='Building Energy'
                data={`${numberFormatter(generateSumOfIsSource(allCheckedOrSelectedDevice, branch[0].branchName)) || 0} kWh`} />
              <TotalCard title='Load Consumption' data={`${numberFormatter(generateSumLoadConsumption(branch))|| 0} kWh`} />
              <TotalCard title='Percentage Load'
                data={`${calculatePercentageTwoDecimal(generateSumLoadConsumption(branch),
                  generateSumOfIsSource(allCheckedOrSelectedDevice, branch[0].branchName))} %`} />
            </div>
            <hr className='load-overview__hr' />
            <RunningTime runningTimeData={generateRunningTimeChartData(branch)}
              dataTitle='Operating Time'
            />
          </article>
          <div className={'load-overviews-row-table-data'} style={{ marginBottom: '50px' }}>
            <article className="load-overviews-table-data">
              <div className='load-overview-card-data__header'>
                <p>
                  Load Consumption
                </p>
              </div>
              <hr />
              <LoadConsumptionPieChart loadCunsumptionData={generateLoadCosumptionChartData(branch)} />
            </article>
            {branch
              .map((eachDeviceData, index) => {
                return <LoadOverviewDataTable device={eachDeviceData} key={index} index={index} />
              })}
          </div>
        </ div>)) :
          <article className='score-card-row-3'>
            <h2> No Data Available </h2>
            <hr />
          </article>
      }
    </>

  );
}

export default LoadOverview;
