import React, { useEffect, useContext, useRef, useState } from "react";
import moment from 'moment';
import { connect, useSelector } from 'react-redux';
import CompleteDataContext from "../Context";

import BreadCrumb from "../components/BreadCrumb";
import DashboardStackedBarChart from "../components/barCharts/DashboardStackedBarChart";
import DashboardDoughnutChart from "../components/pieCharts/DashboardDoughnutChart";
import Loader from "../components/Loader";

import DashboardSmallBannerSection from "../smallComponents/DashboardSmallBannerSection";

import DashboardUpArrow from "../icons/DashboardUpArrow";
import DashboardDownArrow from "../icons/DashboardDownArrow";
import { numberFormatter } from "../helpers/numberFormatter";

// import styles from "../pdfStyles/styles";
import DashBoardAmountUsed from "../smallComponents/DashBoardAmountUsed";
import {
  generateLoadOverviewChartData,
  generateMultipleBranchLoadOverviewChartData
} from "../helpers/genericHelpers";

import LoadOverviewPercentBarChart from "../components/barCharts/LoadOverviewPercentBarChart";
import { fetchBlendedCostData, fetchDashBoardData, fetchDashBoardDataCard_1, fetchDashBoardDataCard_2, fetchDashBoardDataCard_3, fetchPAPR } from "../redux/actions/dashboard/dashboard.action";
import {
  getDashBoardRefinedData,
  getRefinedOrganizationDataWithChekBox,
  getInitialAllDeviceRefinedOrganizationData
} from "../helpers/organizationDataHelpers";
import { getRenderedData } from "../helpers/renderedDataHelpers";
import { isEmpty } from "../helpers/authHelper";

// Tooltips
import { Spin, Tooltip } from 'antd';
import InformationIcon from '../icons/InformationIcon';
import DASHBOARD_TOOLTIP_MESSAGES from '../components/toolTips/Dashboard_Tooltip_Messages';
import { fetchPowerFactor } from "../redux/actions/powerFactor/powerFactor.action";
import { devicesArray } from "../helpers/v2/organizationDataHelpers";
import TotalEnergyCard from "../components/cards/TotalEnergy";
import CarbonEmmission from "../components/cards/CarbonEmmission";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "/", name: "Dashboard", id: 2 },
];

function Dashboard({ match, fetchDashBoardData: dashBoardDataFetch, fetchBlendedCostData:fetchBlendedost, 
  fetchDashBoardDataCard_1, 
  fetchDashBoardDataCard_2, 
  fetchDashBoardDataCard_3,
  sideBar: sideDetails,
  fetchPowerFactor:
  fetchAllPowerFactor,
  fetchPAPR: fetchPAPRData,
  dashboard
}) {
  let {
    checkedItems, checkedBranchId, checkedDevicesId, checkedBranches, checkedDevices, userDateRange, uiSettings } = useContext(
      CompleteDataContext,
    );

  const dashBoardInfo = useSelector((state) => state.dashboard);
  const powerFactor = useSelector((state) => state.powerFactor);

  const { setCurrentUrl, userData } = useContext(CompleteDataContext);
  const [allDeviceInfo, setAllDeviceInfo] = useState(false);
  const [totalEnergyBranchData, setTotalEnergyBranchData] = useState(null);
  const [totalDeviceUsageBranchData, setDeviceUsageBranchData] = useState(null);
  const [refinedDashboardData, setRefinedDashboardData] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);


  const {
    name,
    total_kwh,
    usage_hours,
    dashboard_carbon_emissions,
    cost_of_energy,
    today,
    yesterday,
    daily_kwh,
    solar_hours,
    max_demand_with_power_factor, 
  } = refinedDashboardData;

  useEffect(() => {

    const copyDashBoardData = JSON.parse(JSON.stringify(dashBoardInfo.dashBoardData));

    if (powerFactor.allPowerFactor && powerFactor.allPowerFactor.length> 0 && dashBoardInfo.dashBoardData) {
      if (Object.keys(checkedBranches).length > 0 || Object.keys(checkedDevices).length > 0) {

        const { branchAndDevice, allDeviceData } = getRefinedOrganizationDataWithChekBox({
          checkedBranches,
          checkedDevices,
          organization: copyDashBoardData,
          setRenderedDataObjects: null,
          isDashBoard: true,
          powerFactorData: powerFactor.allPowerFactor
        });

        const renderedData = getRenderedData(Object.values(branchAndDevice), true);
        setRefinedDashboardData(renderedData);
        setAllDeviceInfo(allDeviceData);
      } else {
        setRefinedDashboardData(getDashBoardRefinedData(copyDashBoardData, powerFactor.allPowerFactor));
        setAllDeviceInfo(getInitialAllDeviceRefinedOrganizationData({ organization: copyDashBoardData }));
      }
    }

  }, [checkedBranches, checkedDevices, dashBoardInfo.dashBoardData, powerFactor.allPowerFactor]);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);


  useEffect(() => {
    if (!pageLoaded && isEmpty(dashBoardInfo.dashBoardData || {})) {
      dashBoardDataFetch(userDateRange);
      fetchPAPRData(userDateRange)
      // fetchBlendedost(userDateRange)
      // fetch the power factors here
    }

    if (!isEmpty(dashBoardInfo.dashBoardData) > 0 && pageLoaded) {
      dashBoardDataFetch(userDateRange);
      fetchPAPRData(userDateRange)
      // fetchBlendedost(userDateRange)
      // fetch the power factors here
    }
    setPageLoaded(true);
  }, [userDateRange]);

  useEffect(() => {
    if (Object.keys(sideDetails.sideBarData).length > 0) {

      let allDevices = [];
      sideDetails.sideBarData.branches.forEach((branch) => {
        branch.devices.forEach((device) => {
          allDevices.push(device.device_id)
        })
      })
      const start_date = moment().startOf('month').format('YYYY-MM-DD');
      const end_date = moment().startOf('month').format('YYYY-MM-DD');
      fetchAllPowerFactor(allDevices, { start_date, end_date })

    }

    const branchId = sideDetails?.sideBarData?.branches && sideDetails?.sideBarData?.branches[0]?.branch_id

    if (sideDetails.sideBarData && sideDetails.sideBarData.branches) {
      fetchBlendedost(branchId, userDateRange)
    }
    
  }, [sideDetails.sideBarData, userDateRange]);

  useEffect(() => {
    if (!pageLoaded && isEmpty(dashBoardInfo.dashBoardData || {})) {
      fetchDashBoardDataCard_1(userDateRange);
      fetchDashBoardDataCard_2(userDateRange);
      fetchDashBoardDataCard_3(userDateRange);
    }

    if (!isEmpty(dashBoardInfo.dashBoardData) > 0 && pageLoaded) {
      fetchDashBoardDataCard_1(userDateRange);
      fetchDashBoardDataCard_2(userDateRange);
      fetchDashBoardDataCard_3(userDateRange);
    }
    setPageLoaded(true);
  }, [userDateRange]);


  useEffect(() => {
    if (pageLoaded && dashboard.dashBoardCard_1_Data) {
      const devicesArrayData = devicesArray(dashboard.dashBoardCard_1_Data.branches, checkedBranchId, checkedDevicesId);
      setTotalEnergyBranchData(devicesArrayData)
    }


    setPageLoaded(true);
  }, [dashboard.dashBoardCard_1_Data, checkedBranchId, checkedDevicesId]);


  useEffect(() => {

    if (pageLoaded && dashboard.dashBoardCard_2_Data) {
      console.log('this is the devices array and here we are', dashboard.dashBoardCard_2_Data);
      const devicesArrayData = devicesArray(dashboard.dashBoardCard_2_Data.branches, checkedBranchId, checkedDevicesId);
      setDeviceUsageBranchData(devicesArrayData)
      console.log('this is the devices array and here we are', devicesArrayData);
    }

    setPageLoaded(true);
  }, [dashboard.dashBoardCard_2_Data, checkedBranchId, checkedDevicesId]);

  // useEffect(() => {

  //   if (pageLoaded && dashboard.dashBoardCard_3_Data) {
  //     console.log('this is the devices array and here we are', dashboard.dashBoardCard_2_Data);
  //     const devicesArrayData = devicesArray(dashboard.dashBoardCard_3_Data.branches, checkedBranchId, checkedDevicesId);
  //     setDeviceUsageBranchData(devicesArrayData)
  //     console.log('this is the devices array and here we are', devicesArrayData);
  //   }

  //   setPageLoaded(true);
  // }, [dashboard.dashBoardCard_3_Data, checkedBranchId, checkedDevicesId]);

  console.log(dashboard.dashBoardCard_1_Data)
  console.log('=====',checkedBranchId)
  console.log('============>>>', checkedDevicesId)

  const pageRef = useRef();

  const todaysValue = today && today.value;
  const yesterdaysValue = yesterday && yesterday.value;
  const isTodaysValueLessThanYesterdays = todaysValue < yesterdaysValue;

  if (dashBoardInfo.fetchDashBoardLoading || !pageLoaded) {
    return <Loader />;
  }

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <section id="page" ref={pageRef}>
        <div className="dashboard-row-1">
          <TotalEnergyCard totalEnergyBranchData={totalEnergyBranchData} userData={userData} />

          <article className="dashboard__demand-banner dashboard__banner--small">
            <Spin spinning={!max_demand_with_power_factor}>
              <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20, marginLeft: "auto" }}>
                <Tooltip placement="top" style={{ textAlign: "right" }}
                  overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.MAX_MIN_AVERAGE} >
                  <p>
                    <InformationIcon className="info-icon" />
                  </p>
                </Tooltip>
              </div>
              <div className="dashboard__demand-banner-- ">
                <DashboardSmallBannerSection
                  name="Max. Demand"
                  value={dashboard?.demandData.max_demand}
                  // unit={dashboard?.demandData.unit}
                  unit="kVA"
                />
                <DashboardSmallBannerSection
                  name="Min. Demand"
                  value={dashboard?.demandData.min_demand}
                  // unit={dashboard?.demandData.unit}
                  unit="kVA"
                />
                <DashboardSmallBannerSection
                  name="Avg. Demand"
                  value={dashboard?.demandData.avg_demand}
                  // unit={dashboard?.demandData.unit}
                  unit="kVA"
                />
              </div>
            </Spin>
          </article>

          <CarbonEmmission totalEnergyBranchData={totalEnergyBranchData} userData={userData} />
        </div>
        <div className="dashboard-row-1b">
          {/* {
            allDeviceInfo
            && Object.values(allDeviceInfo).filter(device => device.is_source).map((eachDevice, index) => {
              return index < 6 && eachDevice.is_source && <article key={index}
                className="dashboard__total-energy-amount dashboard__banner--smallb">
                <DashBoardAmountUsed key={index} name={eachDevice?.name}
                  deviceType={eachDevice.device_type}
                  totalKWH={eachDevice?.total_kwh?.value}
                  amount={eachDevice.billing?.totals?.present_total?.value_naira
                  }
                  timeInUse={eachDevice?.usage_hours?.hours[0]}
                />
              </article>
            })
          } */}
          {
            totalDeviceUsageBranchData
            && totalDeviceUsageBranchData.devices.filter(device => device.is_source).map((eachDevice, index) => {
              return index < 6 && eachDevice.is_source && <article key={index}
                className="dashboard__total-energy-amount dashboard__banner--smallb">
                <DashBoardAmountUsed key={index} name={eachDevice?.name}
                  deviceType={eachDevice.device_type}
                  totalKWH={eachDevice?.energy_consumption?.usage}
                  amount={eachDevice.billing?.totals?.present_total?.value_naira
                  }
                  timeInUse={eachDevice?.usage_hours?.hours[0]}
                />
              </article>
            })
          }
        </div>


        <article className="dashboard-row-2 dashboard-bar-container">
          <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20, marginLeft: "auto" }}>
            <Tooltip placement="top" style={{ textAlign: "right" }}
              overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.DAILY_ENERGY} >
              <p>
                <InformationIcon className="info-icon" />
              </p>
            </Tooltip>
          </div>
          <DashboardStackedBarChart
            uiSettings={uiSettings}
            className=""
            data={daily_kwh}
            organization={name}
            sideBarData={sideDetails.sideBarData}
          />
        </article>

        <div className="dashboard-row-3">
          <article className="dashboard-pie-container">
            <div style={{ textAlign: "right", paddingTop: 20, paddingRight: 20, float: "right" }}>
              <Tooltip placement="top" style={{ textAlign: "right" }}
                overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.POWER_USAGE} >
                <p>
                  <InformationIcon className="info-icon" />
                </p>
              </Tooltip>
            </div>
            <DashboardDoughnutChart data={usage_hours} uiSettings={uiSettings} sideBarData={sideDetails.sideBarData} />
          </article>

          <article className="dashboard-today-and-yesterday">
            <div className="today-usage">
              <div style={{ textAlign: "right", paddingRight: 20, position: "relative" }}>
                <Tooltip placement="top" style={{ textAlign: "right" }}
                  overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.TODAY_VS_YESTERDAY} >
                  <p>
                    <InformationIcon className="info-icon" />
                  </p>
                </Tooltip>
              </div>
              <h3 className="today-usage__heading">Today's Usage (kWh)</h3>
              <div className="usage-value-and-arrow">
                <p className="today-usage__value">
                  {numberFormatter(todaysValue) || '0000'}
                </p>
                {isTodaysValueLessThanYesterdays ? (
                  <DashboardDownArrow />
                ) : (
                  <DashboardUpArrow />
                )}
              </div>
            </div>
            <div className="yesterday-usage">
              <h3 className="yesterday-usage__heading">
                Yesterday's Usage (kWh)
              </h3>
              <div className="usage-value-and-arrow">
                <p className="yesterday-usage__value">
                  {numberFormatter(yesterdaysValue) || '0000'}
                </p>
                {isTodaysValueLessThanYesterdays ? (
                  <DashboardUpArrow />
                ) : (
                  <DashboardDownArrow />
                )}
              </div>
            </div>
          </article>
        </div>
        {(userData.client_type === 'BESPOKE') && (dashBoardInfo.dashBoardData || allDeviceInfo) && (
          (dashBoardInfo.dashBoardData.branches.length > 1 &&
            (!checkedItems
              || Object.keys(checkedItems).length === 0)) ||
          (dashBoardInfo.dashBoardData.branches.length === 1
            && generateLoadOverviewChartData(Object.values(allDeviceInfo)).label.length > 0)) && (
            <div className="dashboard-bar-container">
              <article className='score-card-row-3'>
                <LoadOverviewPercentBarChart
                  uiSettings={uiSettings}
                  runningPercentageData={dashBoardInfo.dashBoardData.branches.length > 1 && (!checkedItems
                    || Object.keys(checkedItems).length === 0) ?
                    generateMultipleBranchLoadOverviewChartData(dashBoardInfo.dashBoardData.branches)
                    : generateLoadOverviewChartData(Object.values(allDeviceInfo))}
                  dataTitle='Operating Time'
                />
              </article>
            </div>
          )}
      </section>
    </>
  );
}

const mapDispatchToProps = {
  fetchDashBoardData,
  fetchDashBoardDataCard_1,
  fetchDashBoardDataCard_2,
  fetchDashBoardDataCard_3,
  fetchBlendedCostData,
  fetchPowerFactor,
  fetchPAPR
};
const mapStateToProps = (state) => ({
  sideBar: state.sideBar,
  powerFactor: state.powerFactor,
  dashboard: state.dashboard
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
