import React, { useEffect, useContext, useState } from 'react';
import CompleteDataContext from '../Context';
import { CSVLink } from "react-csv";
import { notification } from "antd"

import {
  formatParametersDatetimes,
  formatParametersDates,
  formatParametersTimes,
  formatParameterTableData,
  convertDateStringsToObjects,
} from '../helpers/genericHelpers';

import BreadCrumb from '../components/BreadCrumb';
import PowerDemandStackedBarChart from '../components/barCharts/PowerDemandStackedBarChart';
import PowerDemandTable from '../components/tables/PowerDemandTable';
import Loader from '../components/Loader';


import ExcelIcon from '../icons/ExcelIcon';
import ExportToCsv from '../components/ExportToCsv';
import { exportToExcel } from '../helpers/exportToFile';
import jsPDF from "jspdf";
import { connect, useSelector } from 'react-redux';
import { fetchPowerDemandData } from '../redux/actions/parameters/parameter.action';
import { devicesArray } from '../helpers/v2/organizationDataHelpers';
import { isEmpty } from '../helpers/authHelper';
import dayjs from 'dayjs';


const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Parameters', id: 2 },
  { url: '#', name: 'Power Demand', id: 3 },
];

function PowerDemand({ match, fetchPowerDemandData }) {
  const [powerDemandData, setPowerDemandData] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const parametersData = useSelector((state) => state.parametersReducer);

  const {
    userDateRange,
    checkedBranchId,
    checkedDevicesId,
    refinedRenderedData,
    setCurrentUrl,
    isAuthenticatedDataLoading,
  } = useContext(CompleteDataContext);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    fetchPowerDemandData(userDateRange)
  }, []);

  useEffect(() => {
    if (!pageLoaded && isEmpty(parametersData || {})) {
      fetchPowerDemandData(userDateRange);
    }

    if (!isEmpty(parametersData) > 0 && pageLoaded) {
      fetchPowerDemandData(userDateRange);
    }
    setPageLoaded(true);
  }, [userDateRange]);

  useEffect(() => {
    if (pageLoaded && parametersData.fetchedPowerDemand) {
      let openDevicesArrayData
      const devicesArrayData = devicesArray(parametersData.fetchedPowerDemand.authenticatedData, checkedBranchId, checkedDevicesId);
      openDevicesArrayData = devicesArrayData && devicesArrayData.devices.map(eachDevice => eachDevice)
      setPowerDemandData(openDevicesArrayData)
    }
    setPageLoaded(true);
  }, [parametersData.fetchedPowerDemand, checkedBranchId, checkedDevicesId.length]);

  const power_demand = powerDemandData.map((deviceDetails) => {
    const { name, power_demand } = deviceDetails
    const { dates: { dates }, power_demand_values: { min, avg, max, demand, units } } = power_demand
    return {
      name,
      dates,
      min,
      avg,
      max,
      demand,
      units
    }
  })

  // const { power_demand } = refinedRenderedData;
  const dateObjects = power_demand.length > 0 && convertDateStringsToObjects(power_demand[0].dates)

  let chartDemandValues, chartDates, chartDeviceNames, chartTooltipValues;
  let powerDemandUnit, powerDemandTableDataClone, arrayOfTableValues, formattedTableDataWithIndex;
  let tableHeadings, csvHeaders, XLSXHeaders, PDFHeaders, arrayOfFormattedTableData, formattedTableData;
  if (power_demand) {

    chartDemandValues =
      power_demand && power_demand.map((eachDevice) => eachDevice.demand);

    chartDeviceNames =
      power_demand && power_demand.map((eachDevice) => eachDevice.name);

    chartTooltipValues =
      power_demand &&
      power_demand.map((eachDevice) => {
        return {
          source: eachDevice.source,
          avg: eachDevice.avg,
          min: eachDevice.min,
          max: eachDevice.max,
        };
      });

    chartDates =
      dateObjects && formatParametersDatetimes(dateObjects);

    powerDemandUnit = power_demand && power_demand.units;

    powerDemandTableDataClone =
      power_demand &&
      power_demand.map((eachDevice) => {
        // Make the device name available at every data point
        const arrayOfDeviceName =
          typeof eachDevice.source === 'string' &&
          Array(eachDevice.avg.length).fill(eachDevice.source);

        // Remove units and data from table data
        const { units, demand, ...dataWithoutUnitsAndDemand } = eachDevice;

        return { ...dataWithoutUnitsAndDemand, source: arrayOfDeviceName };
      });

    tableHeadings = Object.keys({
      date: '',
      time: '',
      ...(powerDemandTableDataClone ? {
        min: powerDemandTableDataClone[0]?.min,
        max: powerDemandTableDataClone[0]?.max,
        avg: powerDemandTableDataClone[0]?.avg,
        demand: powerDemandTableDataClone[0]?.demand,
        name: powerDemandTableDataClone[0]?.name,
      } : []),
    });

    // delete tableHeadings.dates;

    arrayOfTableValues =
      powerDemandTableDataClone &&
      powerDemandTableDataClone.map((eachDevice) => {
        const { name, source, dates, ...others } = eachDevice
        const convertEachDate = dates.map(date => dayjs(date))
        return Object.values({
          date: formatParametersDates(convertEachDate),
          time: formatParametersTimes(convertEachDate),
          ...others,
        });
      });

    arrayOfFormattedTableData =
      arrayOfTableValues &&
      arrayOfTableValues.map((eachDeviceTableValues) => {
        return formatParameterTableData(tableHeadings, eachDeviceTableValues)
      }
      );

    formattedTableData =
      arrayOfFormattedTableData && arrayOfFormattedTableData.flat(1);

    // Re-add indices
    formattedTableDataWithIndex =
      formattedTableData &&
      formattedTableData.map(function (currentValue, index) {

        const { date, time, source, ...others } = currentValue;
        return { index: (index + 1), date, time, source, ...others };
      });
    csvHeaders = [
      { label: "Index", key: "index" },
      { label: "Date", key: "date" },
      { label: "Time", key: "time" },
      { label: "Source", key: "source" },
      { label: `Minimum ${powerDemandUnit}`, key: "min" },
      { label: `Maximum ${powerDemandUnit}`, key: "max" },
      { label: `Average ${powerDemandUnit}`, key: "avg" },
    ]
    XLSXHeaders = [["Index", "Date", "Time", "Source", `Minimum ${powerDemandUnit}`,
      `Maximum ${powerDemandUnit}`, `Average ${powerDemandUnit}`]
    ]
    PDFHeaders = [["Index", "Date", "Time", "Source", `Minimum ${powerDemandUnit}`,
      `Maximum ${powerDemandUnit}`, `Average ${powerDemandUnit}`]
    ]
  }

  if (!power_demand || power_demand.length  === 0) {
     return <Loader />;
   }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {power_demand && <>
        <article className='parameters-stacked-bar-container'>
          <PowerDemandStackedBarChart
            chartDemandValues={chartDemandValues}
            chartDeviceNames={chartDeviceNames}
            chartTooltipValues={chartTooltipValues}
            chartDates={chartDates}
            powerDemandUnit={powerDemandUnit}
          />
        </article>

        <article className='table-with-header-container'>
          <div className='table-header'>
            <div className='h-hidden-medium-down'>
              {/* <button type='button' className='table-header__left-button'>
                PDF
              </button> */}
              <ExportToCsv filename={"power-demand.csv"} csvHeaders={csvHeaders} csvData={formattedTableDataWithIndex}>
                <button type='button' className='table-header__left-button'>
                  CSV
                </button>
              </ExportToCsv>
            </div>

            <h3 className='table-header__heading'>Raw Logs</h3>

            <button
              type='button'
              onClick={() => exportToExcel({ data: formattedTableDataWithIndex, header: XLSXHeaders })}
              className='table-header__right-button h-hidden-medium-down'
            >
              <ExcelIcon />
              <span>Download in Excel</span>
            </button>
          </div>

          <div className='power-demand-table-wrapper'>
            <PowerDemandTable
              powerDemandUnit={powerDemandUnit}
              powerDemandData={formattedTableDataWithIndex}
            />
          </div>
        </article>
      </>
      }
    </>
  );
}

const mapDispatchToProps = {
  fetchPowerDemandData
};
const mapStateToProps = (state) => ({
  parameters: state.parametersReducer,
  sideBar: state.sideBar,
  powerFactor: state.powerFactor,
  dashboard: state.dashboard,
}
);

export default connect(mapStateToProps, mapDispatchToProps)(PowerDemand);