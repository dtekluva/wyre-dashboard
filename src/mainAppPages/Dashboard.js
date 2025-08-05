import React, { useEffect, useContext, useRef, useState } from "react";
import moment from "moment";
import { connect, useSelector } from "react-redux";
import CompleteDataContext from "../Context";

import BreadCrumb from "../components/BreadCrumb";
import Loader from "../components/Loader";

import DashboardSmallBannerSection from "../smallComponents/DashboardSmallBannerSection";

// import styles from "../pdfStyles/styles";
import DashBoardAmountUsed from "../smallComponents/DashBoardAmountUsed";
import {
  calculateDemandMinMaxAvgValues,
  generateLoadOverviewChartData,
  generateMultipleBranchLoadOverviewChartData,
} from "../helpers/genericHelpers";

import LoadOverviewPercentBarChart from "../components/barCharts/LoadOverviewPercentBarChart";
import {
  fetchBlendedCostData,
  fetchDashBoardDataCard_1,
  fetchDashBoardDataCard_2,
  fetchDashBoardDataCard_3,
  fetchPAPR,
} from "../redux/actions/dashboard/dashboard.action";
import { isEmpty } from "../helpers/authHelper";

// Tooltips
import { Spin, Tooltip } from "antd";
import InformationIcon from "../icons/InformationIcon";
import DASHBOARD_TOOLTIP_MESSAGES from "../components/toolTips/Dashboard_Tooltip_Messages";
import { fetchPowerFactor } from "../redux/actions/powerFactor/powerFactor.action";
import { devicesArray } from "../helpers/v2/organizationDataHelpers";
import TotalEnergyCard from "../components/cards/TotalEnergy";
import CarbonEmmission from "../components/cards/CarbonEmmission";
import YesterDayAndTodayCard from "../components/cards/YesterdayAndToday";
import PowerUsageCard from "../components/cards/PowerUsageCard";
import DailyConsumption from "../components/cards/DailyConsumption";
import BranchInfo from "../components/BranchInfo";

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "/", name: "Dashboard", id: 2 },
];

function Dashboard({
  match,
  fetchBlendedCostData: fetchBlendedost,
  fetchDashBoardDataCard_1,
  fetchDashBoardDataCard_2,
  fetchDashBoardDataCard_3,
  sideBar: sideDetails,
  fetchPowerFactor: fetchAllPowerFactor,
  fetchPAPR,
  dashboard,
}) {
  let {
    checkedItems,
    checkedBranchId,
    checkedDevicesId,
    checkedBranches,
    checkedDevices,
    userDateRange,
    uiSettings,
  } = useContext(CompleteDataContext);
  
  
  const dashBoardInfo = useSelector((state) => state.dashboard);
  const branchId =
    sideDetails?.sideBarData?.branches &&
    sideDetails?.sideBarData?.branches[0]?.branch_id;

  const { setCurrentUrl, userData } = useContext(CompleteDataContext);
  const [totalEnergyBranchData, setTotalEnergyBranchData] = useState(null);
  const [totalDeviceUsageBranchData, setTotalDeviceUsageBranchData] =
    useState(null);
  const [totalDailyConsumptionBranchData, setDailyConsumptionBranchData] =
    useState(null);
  const [demandData, setDemandData] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);

  const pDemand = dashboard?.demandData;

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    if (Object.keys(sideDetails.sideBarData).length > 0) {
      let allDevices = [];
      sideDetails.sideBarData.branches.forEach((branch) => {
        branch.devices.forEach((device) => {
          allDevices.push(device.device_id);
        });
      });
      const start_date = moment().startOf("month").format("YYYY-MM-DD");
      const end_date = moment().startOf("month").format("YYYY-MM-DD");
      fetchAllPowerFactor(allDevices, { start_date, end_date });
    }
      fetchBlendedost(userDateRange);
  }, [sideDetails.sideBarData, userDateRange]);

  useEffect(() => {
    if (!pageLoaded && isEmpty(dashBoardInfo.dashBoardData || {})) {
      fetchDashBoardDataCard_1(userDateRange);
      fetchDashBoardDataCard_2(userDateRange);
      fetchDashBoardDataCard_3(userDateRange);
      fetchPAPR(userDateRange)
    }

    if (!isEmpty(dashBoardInfo.dashBoardData) > 0 && pageLoaded) {
      fetchDashBoardDataCard_1(userDateRange);
      fetchDashBoardDataCard_2(userDateRange);
      fetchDashBoardDataCard_3(userDateRange);
      fetchPAPR(userDateRange)
    }
    setPageLoaded(true);
  }, [userDateRange]);

  useEffect(() => {
    if (Object.keys(dashboard.demandData).length > 0) {
      const demandDataInfo = calculateDemandMinMaxAvgValues(
        dashboard.demandData?.[0]?.devices_demands
      );
      setDemandData(demandDataInfo);
    }
  }, [dashboard.demandData]);

  useEffect(() => {
    if (pageLoaded && dashboard.dashBoardCard_1_Data) {
      const devicesArrayData = devicesArray(
        dashboard.dashBoardCard_1_Data.branches,
        checkedBranchId,
        checkedDevicesId
      );
      setTotalEnergyBranchData(devicesArrayData[0]);
    }
    setPageLoaded(true);
  }, [
    dashboard.dashBoardCard_1_Data,
    checkedBranchId,
    checkedDevicesId.length,
  ]);

  useEffect(() => {
    if (pageLoaded && dashboard.dashBoardCard_2_Data) {
      const devicesArrayData = devicesArray(
        dashboard.dashBoardCard_2_Data.branches,
        checkedBranchId,
        checkedDevicesId
      );
      setTotalDeviceUsageBranchData(devicesArrayData[0]);
    }

    setPageLoaded(true);
  }, [
    dashboard.dashBoardCard_2_Data,
    checkedBranchId,
    checkedDevicesId.length,
  ]);

  useEffect(() => {
    if (pageLoaded && dashboard.dashBoardCard_3_Data) {
      const devicesArrayData = devicesArray(
        dashboard.dashBoardCard_3_Data.branches,
        checkedBranchId,
        checkedDevicesId
      );
      setDailyConsumptionBranchData(devicesArrayData[0]);
    }

    setPageLoaded(true);
  }, [
    dashboard.dashBoardCard_3_Data,
    checkedBranchId,
    checkedDevicesId.length,
  ]);

  const pageRef = useRef();

  if (dashBoardInfo.fetchDashBoardLoading || !pageLoaded) {
    return <Loader />;
  }

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      {/* Branch Information Demo */}
      {/* <BranchInfo /> */}

      <section id="page" ref={pageRef}>
        <div className="dashboard-row-1">
          <TotalEnergyCard
            totalEnergyBranchData={totalEnergyBranchData}
            userData={userData}
          />

          <article className="dashboard__demand-banner dashboard__banner--small">
            <Spin
              spinning={dashboard.fetchDemandLoading}
            >
              <div
                style={{
                  textAlign: "right",
                  paddingTop: 20,
                  paddingRight: 20,
                  marginLeft: "auto",
                }}
              >
                <Tooltip
                  placement="top"
                  style={{ textAlign: "right" }}
                  overlayStyle={{ whiteSpace: "pre-line" }}
                  title={DASHBOARD_TOOLTIP_MESSAGES.MAX_MIN_AVERAGE}
                >
                  <p>
                    <InformationIcon className="info-icon" />
                  </p>
                </Tooltip>
              </div>
              <div className="dashboard__demand-banner-- ">
                <DashboardSmallBannerSection
                  name="Max. Demand"
                  value={demandData.max_demand}
                  // unit={dashboard?.demandData.unit}
                  unit="kVA"
                />
                <DashboardSmallBannerSection
                  name="Min. Demand"
                  value={demandData.min_demand}
                  // unit={dashboard?.demandData.unit}
                  unit="kVA"
                />
                <DashboardSmallBannerSection
                  name="Avg. Demand"
                  value={demandData.avg_demand}
                  // unit={dashboard?.demandData.unit}
                  unit="kVA"
                />
              </div>
            </Spin>
          </article>

          <CarbonEmmission
            totalEnergyBranchData={totalEnergyBranchData}
            userData={userData}
          />
        </div>
        <Spin
          spinning={dashboard.fetchDashBoardCard_2_Loading}
        >
          <div className="dashboard-row-1b">
            {totalDeviceUsageBranchData && totalDeviceUsageBranchData.devices &&
              totalDeviceUsageBranchData.devices
                .filter((device) => device.is_source)
                .map((eachDevice, index) => {
                  return (
                    index < 6 &&
                    eachDevice.is_source && (
                      <article
                        key={index}
                        className="dashboard__total-energy-amount dashboard__banner--smallb"
                      >
                        <DashBoardAmountUsed
                          key={index}
                          name={eachDevice?.name}
                          deviceType={eachDevice.device_type}
                          totalKWH={eachDevice?.energy_consumption?.usage}
                          amount={
                            eachDevice.billing_totals?.present_total?.value_naira
                          }
                          timeInUse={eachDevice?.usage_hours}
                        />
                      </article>
                    )
                  );
                })}
          </div>
        </Spin>

        <DailyConsumption
          totalDailyConsumptionBranchData={totalDailyConsumptionBranchData}
          uiSettings={uiSettings}
          sideDetails={sideDetails}
        />

        <div className="dashboard-row-3">
          <PowerUsageCard
            totalDeviceUsageBranchData={totalDeviceUsageBranchData}
            uiSettings={uiSettings}
            sideDetails={sideDetails}
          />
          <YesterDayAndTodayCard
            totalEnergyBranchData={totalEnergyBranchData}
          />
        </div>

        {userData.client_type === "BESPOKE" &&
          dashboard.dashBoardCard_1_Data &&
          ((dashboard.dashBoardCard_1_Data.branches.length > 1 &&
            (!checkedItems || Object.keys(checkedItems).length === 0)) ||
            (dashboard.dashBoardCard_1_Data.branches.length === 1 &&
              generateLoadOverviewChartData(
                dashboard.dashBoardCard_1_Data.branches[0].devices
              ).label.length > 0)) && (
            <div className="dashboard-bar-container">
              <article className="score-card-row-3">
                <LoadOverviewPercentBarChart
                  uiSettings={uiSettings}
                  pDemand={pDemand}
                  runningPercentageData={
                    dashboard.dashBoardCard_1_Data.branches.length > 1 &&
                    (!checkedItems || Object.keys(checkedItems).length === 0)
                      ? generateMultipleBranchLoadOverviewChartData(
                          dashboard.dashBoardCard_1_Data.branches
                        )
                      : generateLoadOverviewChartData(
                          dashboard.dashBoardCard_1_Data.branches[0].devices
                        )
                  }
                  dataTitle="Operating Time"
                />
              </article>
            </div>
          )}
      </section>
    </>
  );
}

const mapDispatchToProps = {
  fetchDashBoardDataCard_1,
  fetchDashBoardDataCard_2,
  fetchDashBoardDataCard_3,
  fetchBlendedCostData,
  fetchPowerFactor,
  fetchPAPR,
};
const mapStateToProps = (state) => ({
  sideBar: state.sideBar,
  powerFactor: state.powerFactor,
  dashboard: state.dashboard,
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
