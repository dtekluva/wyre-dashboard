import React, { useEffect, useContext, useRef, useState } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
// import { jsPDF } from "jspdf";
import { connect, useSelector } from 'react-redux';
import html2pdf from "html2pdf.js"
import * as html2canvas from "html2canvas";
import CompleteDataContext from "../Context";
// import 

import BreadCrumb from "../components/BreadCrumb";
import DashboardStackedBarChart from "../components/barCharts/DashboardStackedBarChart";
import DashboardDoughnutChart from "../components/pieCharts/DashboardDoughnutChart";
import Loader from "../components/Loader";

import DashboardSmallBannerSection from "../smallComponents/DashboardSmallBannerSection";
// import PrintButtons from "../smallComponents/PrintButtons";

import DashboardUpArrow from "../icons/DashboardUpArrow";
import DashboardDownArrow from "../icons/DashboardDownArrow";
import { numberFormatter } from "../helpers/numberFormatter";

import styles from "../pdfStyles/styles";
import DashBoardAmountUsed from "../smallComponents/DashBoardAmountUsed";
import {
  generateLoadOverviewChartData, refineLoadOverviewData,
  generateMultipleBranchLoadOverviewChartData, allCheckedDeviceGenerators
} from "../helpers/genericHelpers";
import LoadOverviewPercentBarChart from "../components/barCharts/LoadOverviewPercentBarChart";
import { fetchDashBoardData } from "../redux/actions/dashboard/dashboard.action";
import {
  getDashBoardRefinedData,
  getRefinedOrganizationDataWithChekBox,
  getInitialAllDeviceRefinedOrganizationData
} from "../helpers/organizationDataHelpers";
import { getRenderedData } from "../helpers/renderedDataHelpers";
import { isEmpty } from "../helpers/authHelper";

// Tooltips
import { Tooltip } from 'antd';
import InformationIcon from '../icons/InformationIcon';
import DASHBOARD_TOOLTIP_MESSAGES from '../components/toolTips/Dashboard_Tooltip_Messages';

const breadCrumbRoutes = [
  { url: "/", name: "Home", id: 1 },
  { url: "/", name: "Dashboard", id: 2 },
];

const PDFDocument = () => (
  <Document>
    <Page size="A4" styles={styles.page}>
      <View>
        <Text>Section #1</Text>
      </View>

      <View>
        <Text>Section #2</Text>
      </View>
    </Page>
  </Document>
);

function Dashboard({ match, fetchDashBoardData: dashBoardDataFetch }) {
  let {
    checkedItems, checkedBranches, checkedDevices, userDateRange, uiSettings } = useContext(
      CompleteDataContext,
    );

  const dashBoardInfo = useSelector((state) => state.dashboard);

  const { setCurrentUrl, userData } = useContext(CompleteDataContext);
  const [allDeviceInfo, setAllDeviceInfo] = useState(false);
  const [refinedDashboardData, setRefinedDashboardData] = useState({});
  const [pageLoaded, setPageLoaded] = useState(false);

  const {
    name,
    total_kwh,
    min_demand,
    max_demand,
    usage_hours,
    avg_demand,
    dashboard_carbon_emissions,
    cost_of_energy,
    today,
    yesterday,
    daily_kwh,
    solar_hours,
  } = refinedDashboardData;



  useEffect(() => {

    const copyDashBoardData = JSON.parse(JSON.stringify(dashBoardInfo.dashBoardData));
    if (dashBoardInfo.dashBoardData) {
      if (Object.keys(checkedBranches).length > 0 || Object.keys(checkedDevices).length > 0) {

        const { branchAndDevice, allDeviceData } = getRefinedOrganizationDataWithChekBox({
          checkedBranches,
          checkedDevices,
          organization: copyDashBoardData,
          setRenderedDataObjects: null,
          isDashBoard: true
        });

        const renderedData = getRenderedData(Object.values(branchAndDevice), true);
        setRefinedDashboardData(renderedData);
        setAllDeviceInfo(allDeviceData);
      } else {
        setRefinedDashboardData(getDashBoardRefinedData(copyDashBoardData));
        setAllDeviceInfo(getInitialAllDeviceRefinedOrganizationData({ organization: copyDashBoardData }));
      }
    }

  }, [checkedBranches, checkedDevices, dashBoardInfo.dashBoardData]);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);



  useEffect(() => {
    if (!pageLoaded && isEmpty(dashBoardInfo.dashBoardData || {})) {
      dashBoardDataFetch(userDateRange);
    }

    if (!isEmpty(dashBoardInfo.dashBoardData) > 0 && pageLoaded) {
      dashBoardDataFetch(userDateRange);
    }
    setPageLoaded(true);
  }, [userDateRange]);


  const pageRef = useRef();

  const todaysValue = today && today.value;
  const yesterdaysValue = yesterday && yesterday.value;
  const isTodaysValueLessThanYesterdays = todaysValue < yesterdaysValue;

  const generatePdf = () => {
    console.log("Generating PDFs");

    const input = document.getElementById("page");
    const page = document.querySelector(".page-content")
    html2pdf(page)

    // window
    // .open("", "PRINT", "height=650,width=900,top=100,left=100")
    // .document.write("Testing PDfs")
    // .document.close()
    // .focus()
    // .print()
    // .close();

    // html2canvas(input)
    //   .then((canvas) => {
    //     const imgData = canvas.toDataURL('image/png');
    //     const pdf = new jsPDF('p', 'px', 'a4');
    //     var width = pdf.internal.pageSize.getWidth();
    //     var height = pdf.internal.pageSize.getHeight();

    //     pdf.addImage(imgData, 'JPEG', 0, 0, width, height);
    //     pdf.save("test.pdf");
    //   });
  };

  if (dashBoardInfo.fetchDashBoardLoading || !pageLoaded) {
    return <Loader />;
  }

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
        {/* <PrintButtons
          onClick={generatePdf}
          document={<PDFDocument />}
          fileName={"dashboard.pdf"}
        /> */}
      </div>

      <section id="page" ref={pageRef}>
        <div className="dashboard-row-1">
          <article className="dashboard__total-energy dashboard__banner--small">
            <div style={{ textAlign: "right", paddingRight: 20, paddingTop: 20, marginLeft: "auto" }}>
              <Tooltip placement="top" style={{ textAlign: "right" }}
                overlayStyle={{ whiteSpace: "pre-line" }} title={DASHBOARD_TOOLTIP_MESSAGES.TOTAL_ENERGY} >
                <p>
                  <InformationIcon className="info-icon" style={{ color: "white" }} />
                </p>
              </Tooltip>
            </div>
            <h2 className="total-energy__heading">Total Energy</h2>
            <p className="total-energy_value">
              <span>{total_kwh && numberFormatter(total_kwh.value)}</span>
              <span>{total_kwh && total_kwh.unit}</span>
            </p>
            {userData.decodedUser.client_type !== 'RESELLER' &&
              <p className="total-energy_value solar-energy_value">
                <span>{'('}Solar Hours: {solar_hours && numberFormatter(solar_hours.value)} </span>
                <span>{solar_hours && solar_hours.unit}{')'}</span>
              </p>
            }
          </article>

          <article className="dashboard__demand-banner dashboard__banner--small">
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
                value={max_demand && numberFormatter(max_demand.value.toFixed(2))}
                unit={max_demand && max_demand.unit}
              />
              <DashboardSmallBannerSection
                name="Min. Demand"
                value={min_demand && numberFormatter(min_demand.value.toFixed(2))}
                unit={min_demand && min_demand.unit}
              />
              <DashboardSmallBannerSection
                name="Avg. Demand"
                value={avg_demand && numberFormatter(avg_demand.value.toFixed(2))}
                unit={avg_demand && avg_demand.unit}
              />
            </div>
          </article>

          <article className="dashboard__cost-emissions-banner dashboard__banner--small">
            <DashboardSmallBannerSection
              name="Carbon Emissions"
              value={
                dashboard_carbon_emissions &&
                numberFormatter(dashboard_carbon_emissions.value.toFixed(2))
              }
              unit={
                dashboard_carbon_emissions && dashboard_carbon_emissions.unit
              }
            />
            <DashboardSmallBannerSection
              name="Blended Cost of Energy"
              value={
                cost_of_energy &&
                numberFormatter(cost_of_energy.value.toFixed(2))
              }
              unit={cost_of_energy && cost_of_energy.unit}
            />
          </article>
        </div>
        <div className="dashboard-row-1b">
          {
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
            <DashboardDoughnutChart data={usage_hours} uiSettings={uiSettings} />
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
        {(userData.decodedUser.client_type === 'BESPOKE') && (dashBoardInfo.dashBoardData || allDeviceInfo) && (
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
};


export default connect(null, mapDispatchToProps)(Dashboard);
