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
import { fetchLoadOverviewData, fetchPAPR } from '../redux/actions/dashboard/dashboard.action';
import { connect, useSelector } from 'react-redux';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Load Overview', id: 2 },
];


function LoadOverview({ match, fetchLoadOverviewData, dashboard, sideBar, fetchPAPR, pDemand }) {
  const {
    setCurrentUrl,
    userDateRange,
  } = useContext(CompleteDataContext);
  const [allCheckedOrSelectedDevice, setAllCheckedOrSelectedDevice] = useState({})
  const [sideDetails, setSideDetails] = useState([])
  const [pDemandDetails, setPDemandDetails] = useState({})
  const [demandInTable, setDemandInTable] = useState({})
  const [allIsLoadDeviceData, setAllisLoadDeviceData] = useState(false);
  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    fetchLoadOverviewData(userDateRange)
    fetchPAPR(userDateRange)
  }, [userDateRange]);

  useEffect(() => {
    if (sideBar.sideBarData.branches) {
      const sideBarData = sideBar?.sideBarData?.branches[0]?.devices
      const filterdSideBarData = sideBarData.filter(device => device.is_load)

      setSideDetails(filterdSideBarData)
    }
  }, [sideBar.sideBarData]);

  useEffect(() => {
    if (dashboard.demandData.devices_demands) {
      const useDemand = dashboard.demandData.devices_demands.map(demand => demand)
      setPDemandDetails(useDemand)
    }
  }, [dashboard.demandData]);

  useEffect(() => {
    if (dashboard.loadOverviewData) {
      const useLoad = dashboard.loadOverviewData.branches[0].devices
      setAllCheckedOrSelectedDevice(useLoad)
      const data = refineLoadOverviewData(useLoad);
      setAllisLoadDeviceData(Object.values(data));
    }   
  }, [dashboard.loadOverviewData]);

  useEffect( () => {
    if (sideDetails && pDemandDetails) {
      // const dataMap = new Map(array2.map(item => [item.id, item]));
      // const lookUpData = new Map(pDemandDetails.map(demand => [demand.device_name, demand]))
      // const result = array1.map(id => dataMap.get(id) || { id, name: "Not Found" });
      // const renderTableData = sideDetails.map(data => lookUpData.get(data) || {data, name: 'Not found' })
      const renderTableData = sideDetails.map(data => pDemandDetails.find(demand => demand.device_name === data.name))
      console.log('renderTableData == ', renderTableData.map(data => data.max));
      setDemandInTable(renderTableData)
    }
  }, [sideDetails && pDemandDetails])

  const TotalCard = ({ title, data }) => (
    <div className='load-overview-total-card'>
      <div className='load-overview-total-content'>
        <h4>{title}</h4>
        <p >{data}</p>
      </div>
    </div>
  );
  console.log('state of power demand == ', demandInTable);


  if (!dashboard.loadOverviewData) {
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
                return <LoadOverviewDataTable device={eachDeviceData} key={index} index={index} pDemand={demandInTable.find(eachDevice => eachDeviceData.name === eachDevice.device_name)} />
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

const mapDispatchToProps = {
  fetchLoadOverviewData,
  fetchPAPR
};

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
  sideBar: state.sideBar,
});

export default connect(mapStateToProps, mapDispatchToProps)(LoadOverview);
