import React, { useEffect, useContext, useState } from 'react';
import moment from 'moment';

import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';

import GenericReportTable from '../components/tables/reportTables/GenericReportTable';
import ReportDailyConsumptionBar from '../components/barCharts/ReportDailyConsumptionBar';

import StopWatch from '../icons/StopWatch';
import Plug from '../icons/Plug';
import ElectricSpark from '../icons/ElectricSpark';
import CO2Icon from '../icons/CarbonFootPrint';
import DownWithBaseLine from '../icons/DownWithBaseLine';
import RecordCard from '../smallComponents/reports/RecordCard';
import MiniDoubleCard from '../smallComponents/reports/MiniDoubleCard';
import LargeDoubleCard from '../smallComponents/reports/LargeDoubleCard';
import SourceConsumptionPieChart from '../smallComponents/reports/SourceConsumptionPieChart';
import {
  CostImplicationColumn, DemandAndStatisticsColumn,
  DemandAndStatisticsTwoColumn,
  FuelConsumption, GeneratorEfficiency,
  LoadImbalanceColumns, PowerDemandColumns, TimeOfUseColumns
} from '../helpers/tableColumns';

import Loader from '../components/Loader';
import LoadImbalanceReportTable from '../components/tables/reportTables/LoadImbalanceReportTable';
import { connect, useSelector } from 'react-redux';
import { fetchReportData, fetchBaseLineData } from '../redux/actions/report/report.action';
import { fetchPAPR } from "../redux/actions/dashboard/dashboard.action";
import EnergyConsumptionMultipleChart from '../components/barCharts/EnergyConsumptionMultipleChart';
import { loadReportPage } from '../redux/actions/setting/actionCreators';
import { isEmpty } from '../helpers/authHelper';
import ReportTimeOfUse from '../components/tables/reportTables/ReportTimeOfUse';
import { ConstImplicationSummary } from '../components/tables/reportTables/TablesSummaries';
import { calculateDemandMinMaxAvgValues } from '../helpers/genericHelpers';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button } from 'antd';


const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Report', id: 2 },
];


function Report({ match, fetchReportData: fetchReport, fetchBaseLineData: fetchReportBaseline, fetchPAPR: fetchPAPRData, dashboard }) {
  const [reportPageData, setReportPageData] = useState({});
  const [reportBaselinePageData, setReportBaselinePageData] = useState({});
  const [timeOfUseData, setTimeOfUseData] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const report = useSelector((state) => state.report);
    const [demandData, setDemandData] = useState({});
  const sideBarData = useSelector((state) => state.sideBar.sideBarData);
  const {
    setCurrentUrl,
    uiSettings
  } = useContext(CompleteDataContext);

  const PowerDemandColumnsList = PowerDemandColumns(dashboard?.demandData['p.f'])
  const generatePdf = () => {
    console.log("Generating PDFs");

    const input = document.getElementById("page");
    const page = document.querySelector(".page-content")

    // window
    // .open("", "PRINT", "height=650,width=900,top=100,left=100")
    // .document.write("Testing PDfs")
    // .document.close()
    // .focus()
    // .print()
    // .close();

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        // const pdf = new jsPDF('p', 'px', 'a2');
        const pdf = new jsPDF('p', 'px', [595, 1342]);
        // const pdf = new jsPDF('p', 'px', [475]);

        // const pdf = new jsPDF('p', 'px', [40, 90]);
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();


        pdf.addImage(imgData, 'JPEG', 1, 1, width, height);
        pdf.save("report.pdf");
      });
  };

  useEffect(() => {
    if(dashboard.demandData && Object.keys(dashboard.demandData).length > 0){
      const demandDataInfo = calculateDemandMinMaxAvgValues(dashboard.demandData.devices_demands);
      setDemandData(demandDataInfo)
    }

  }, [dashboard.demandData]);


  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const energyConsumptionCombined = (allArray) => {
    const consumption = []
    Object.values(allArray).map((data) => {
      consumption.push(...data);
    });
    return consumption;
  }

  useEffect(() => {
    if (!pageLoaded && isEmpty(report.reportData || {})) {

      let search = window.location.search;
      let params = new URLSearchParams(search);
      let reportDate = params.get('reportDate') || null;
      const defaultDataValue = reportDate ? moment(reportDate).format('DD-MM-YYYY') : moment(report.selectedDate, 'DD-MM-YYYY').format('DD-MM-YYYY');

      fetchReport(defaultDataValue, report.selectedDateType);
      fetchReportBaseline(report.selectedDate, report.selectedDateType);
      const startDate = moment(defaultDataValue, 'DD-MM-YYYY').startOf('month');

      const endDate = moment(defaultDataValue, 'DD-MM-YYYY').endOf('month');
      fetchPAPRData([startDate, endDate]);
    }

    if (!isEmpty(report.reportData) > 0 && pageLoaded) {
      fetchReport(report.selectedDate, report.selectedDateType);
      fetchReportBaseline(report.selectedDate, report.selectedDateType);

      const startDate =  moment(report.selectedDate, 'DD-MM-YYYY').startOf('month');
      const endDate = moment(report.selectedDate, 'DD-MM-YYYY').endOf('month');
      fetchPAPRData([startDate, endDate]);
    }
    setPageLoaded(true);
  }, [report.selectedDateType, report.selectedDate]);

  useEffect(() => {
    setReportPageData(report.reportData)
  }, [report.reportData]);

  useEffect(() => {
    setReportBaselinePageData(report.reportBaselineData)
  }, [report.reportBaselineData]);


  const {
    period_score,
    total_energy_consumption,
    power_demand,
    papr,
    // baseline,
    carbon_emmissions,
    source_consumption,
    load_imbalance,
    time_of_use,
    fuel_consumption,
    generator_efficiency,
    cost_implication,
    daily_consumption,
    demand_statistic,
    energy_consumption,
  } = Object.values(reportPageData)[0] ? Object.values(reportPageData)[0] : {};

  const {
    baseline,
  } = Object.values(reportBaselinePageData)[0] ? Object.values(reportBaselinePageData)[0] : {};

  let powerDemand = []
  power_demand && Object.entries(power_demand).map(([key, value]) => {
    powerDemand.push({ key, ...value })
  })

  useEffect(() => {
    const timeOfUse = time_of_use && time_of_use.devices.map((deviceName, index) => {
      return {
        name: deviceName,
        hour: time_of_use.hours[index],
        blackOut: Number(time_of_use.period_total_hours - time_of_use.hours[index]).toFixed(2),
      }
    });
    setTimeOfUseData(timeOfUse);
  }, [reportPageData]);

  if (report.fetchReportLoading) {
    return <Loader />;
  }

  return (
    <div >
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
        {/* <div></div> */}
        <Button onClick={generatePdf}>Download Report</Button>
      </div>
      <div id='page'>
        <div className="report-row-1">
          {/* <h2 className="report-row-1__heading report-row-heading h-first">
            Top Management
          </h2> */}
          <div className="report-row-1__content">
            {/* {
            period_score &&
            <RecordCard {...period_score}
              header='Period Score'
              footer="Score as compared to previous period"
              icon={StopWatch} type='periodScore' />
          } */}
            {
              total_energy_consumption &&
              <RecordCard {...total_energy_consumption}
                header='Total Consumption'
                footer="Total Energy Consumption accross sources"
                icon={ElectricSpark} type='energyConsumptionScore' />
            }
            {dashboard?.demandData &&
              <MiniDoubleCard
                paprRatio={dashboard?.demandData.papr}
                // paprRatio={calculateRatio(papr.metrics.peak_to_avg_power_ratio.avg, papr.metrics.peak_to_avg_power_ratio.peak)}
                metrics={demandData} type='paprScore'
                header='PAPR' icon={Plug} />
            }
          </div>
        </div>
        <div className="report-row-1">
          <div className="report-row-1__content">
            {
              carbon_emmissions &&
              <RecordCard {...carbon_emmissions}
                header='CO2 Footprint'
                footer="Carbon Emmission"
                icon={CO2Icon} type='CO2Score' />
            }
            {
              baseline &&
              <LargeDoubleCard baseLine={baseline}
                metrics={baseline?.unit} type='paprScore'
                header='Baseline Consumption'
                icon={DownWithBaseLine} />
            }
          </div>
        </div>

        <div className="report-table-rows">
          <div className="report-row-1__content">
            <div className="report-pie-container">
              <h2 className='report-pie-heading'>
                Source Consumption(kWh)
              </h2>
              {
                source_consumption &&
                <SourceConsumptionPieChart
                  data={source_consumption} />
              }
            </div>
            {(
              <div className="report-after-pie-table-container">
                <div className="h-overflow-auto report-card-tabble__padding">
                  <h2 className="report-pie-heading">
                    Load Imbalance Occurence
                  </h2>
                  <LoadImbalanceReportTable data={load_imbalance}
                    columnData={LoadImbalanceColumns} />
                </div>
              </div>
            )}
          </div>
        </div>
        {fuel_consumption?.length > 0 && generator_efficiency?.length > 0 &&
          <div className="report-table-rows">
            <div className="report-row-1__content">
              {(
                <div className="report-table-container">
                  <div className="h-overflow-auto report-card-tabble__padding">
                    <h2 className="report-pie-heading">
                      Fuel Consumption
                    </h2>
                    <GenericReportTable data={fuel_consumption}
                      columnData={FuelConsumption} />
                  </div>
                </div>
              )}
              {(
                <div className="report-table-container">
                  <div className="h-overflow-auto report-card-tabble__padding">
                    <h2 className="report-pie-heading">
                      Generator Efficiency & Recommendation
                    </h2>
                    <GenericReportTable data={generator_efficiency}
                      columnData={GeneratorEfficiency} />
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        {/* <div className="report-full-width-rows">
          <div className="report-row-1__content">
            {daily_consumption && (
              <div className="report-chart-container">
                <h2 className="report-pie-heading">
                  Daily fuel consumption
                </h2>
                <ReportDailyConsumptionBar dailyConsumptionData={daily_consumption}
                />
              </div>
            )}
          </div>
        </div> */}
        <div className="report-full-width-rows-fit-content">
          <div className="report-row-1__content">
            {energy_consumption && (
              <div className="report-double-chart-container">
                <h2 className="report-pie-heading">
                  Energy Consumption
                </h2>
                <EnergyConsumptionMultipleChart uiSettings={uiSettings} energyData={energyConsumptionCombined(energy_consumption)}
                />
              </div>
            )}
          </div>
        </div>
        {/* <div className="report-full-width-with-no-height-rows">
          <div className="report-row-1__content">
            {(
              <div className="report-demand-container">
                <div className="h-overflow-auto report-card-tabble__padding">
                  <h2 className="report-pie-heading">
                    Demand and Statistics
                  </h2>
                  <GenericReportTable data={demand_statistic}
                    columnData={DemandAndStatisticsColumn} />
                  <hr className='demand-statistic-space-hr' />
                  <GenericReportTable data={demand_statistic}
                    columnData={DemandAndStatisticsTwoColumn} />
                </div>
              </div>
            )}
          </div>
        </div> */}
        <div className="report-full-width-with-no-height-rows">
          <div className="report-row-1__content">
            {(
              <div className="report-chart-container">
                <div className="h-overflow-auto report-card-tabble__padding">
                  <h2 className="report-pie-heading">
                    Cost Implication
                  </h2>
                  <GenericReportTable data={cost_implication}
                    columnData={CostImplicationColumn} summary={ConstImplicationSummary} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="report-table-rows">
          <div className="report-row-1__content">
            {(
              <div className="report-table-bottom-container">
                <div className="h-overflow-auto report-card-tabble__padding">
                  <h2 className="report-pie-heading">
                    Time of Use
                  </h2>
                  <ReportTimeOfUse data={timeOfUseData}
                    columnData={TimeOfUseColumns} />
                </div>
              </div>
            )}
            {(
              <div className="report-table-bottom-container">
                <div className="h-overflow-auto report-card-tabble__padding">
                  <h2 className="report-pie-heading">
                    Power Demand
                  </h2>
                  <GenericReportTable data={dashboard?.demandData.devices_demands}
                    columnData={PowerDemandColumnsList} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  fetchReportData,
  fetchBaseLineData,
  fetchPAPR
};
const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
});

export default connect(mapStateToProps, mapDispatchToProps)(Report);
