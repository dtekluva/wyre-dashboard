import React, { useEffect, useContext, useState } from 'react';


import CompleteDataContext from '../Context';

import {
  formatParametersDatetimes,
  formatParametersDates,
  formatParametersTimes,
  formatParameterTableData,
  convertDateStringsToObjects,
} from '../helpers/genericHelpers';
import { numberFormatter } from "../helpers/numberFormatter"

import BreadCrumb from '../components/BreadCrumb';
import { sumOrganizationEnergyConsumptionValues } from "../helpers/organizationDataHelpers"
import EnergyConsumptionBarChart from '../components/barCharts/EnergyConsumptionBarChart';
import EnergyConsumptionTable from '../components/tables/EnergyConsumptionTable';
import Loader from '../components/Loader';

import ExcelIcon from '../icons/ExcelIcon';
import ExportToCsv from '../components/ExportToCsv';
import { fetchEnergyConsumptionData } from '../redux/actions/parameters/parameter.action';
import { connect, useSelector } from 'react-redux';
import parametersReducer from '../redux/reducers/parameters/parameters.reducer';
import { isEmpty } from '../helpers/authHelper';
import { devicesArray } from '../helpers/v2/organizationDataHelpers';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Parameters', id: 2 },
  { url: '#', name: 'Energy Consumption', id: 3 },
];

function EnergyConsumption({ match, fetchEnergyConsumptionData }) {
  const [energyConsumptionData, setEnergyConsumptionData] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const {
    userDateRange,
    checkedBranchId,
    checkedDevicesId,
    setCurrentUrl,
  } = useContext(CompleteDataContext);

  const parametersData = useSelector((state) => state.parametersReducer);
  
  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    fetchEnergyConsumptionData(userDateRange)
  }, []);

  useEffect(() => {
      if (!pageLoaded && isEmpty(parametersData || {})) {
        fetchEnergyConsumptionData(userDateRange);
      }
  
      if (!isEmpty(parametersData) > 0 && pageLoaded) {
        fetchEnergyConsumptionData(userDateRange);
      }
      setPageLoaded(true);
  }, [userDateRange]);

  useEffect(() => {
      if (pageLoaded && parametersData.fetchedEnergyConsumption) {
        let openDevicesArrayData
        const devicesArrayData = devicesArray(parametersData.fetchedEnergyConsumption.branches, checkedBranchId, checkedDevicesId);
        openDevicesArrayData = devicesArrayData && devicesArrayData.devices.map(eachDevice => eachDevice)
        setEnergyConsumptionData(openDevicesArrayData)
      }
      setPageLoaded(true);
  }, [parametersData.fetchedEnergyConsumption, checkedBranchId, checkedDevicesId.length]);

  const useEnergyConsumptionData = energyConsumptionData.map((deviceDetails) => {
    const { name, energy_consumption } = deviceDetails
    const { dates:{dates}, energy_consumption_values:{value, units}, previous, current, usage } = energy_consumption
    return {
      name,
      dates,
      value,
      units,
      previous,
      current,
      usage
    }
  }
  );
  let chartConsumptionValues, allDeviceNames, chartDates, energyConsumptionUnit;
  let allDates, tableHeadings, formattedTableData, dataForEnergyConsumptionColumns;
  let deviceNames, energyConsumptionColumns, energyConsumptionValuesTableDataClone;
  let tableEnergyConsumptionValues, tableValues, csvHeaders;

  const energy_consumption_previous = useEnergyConsumptionData.reduce((sum, item) => sum + item.previous, 0);
  const energy_consumption_current = useEnergyConsumptionData.reduce((sum, item) => sum + item.current, 0);
  const energy_consumption_usage = useEnergyConsumptionData.reduce((sum, item) => sum + item.usage, 0);

  // if (energy_consumption_usage && energy_consumption_values) {
  //   chartConsumptionValues =
  //     energy_consumption_values &&
  //     energy_consumption_values.map((eachDevice) => eachDevice.value);

  //   allDeviceNames =
  //     energy_consumption_values &&
  //     energy_consumption_values.map((eachDevice) => eachDevice.deviceName);

  //   chartDates =
  //     energy_consumption_values &&
  //     formatParametersDatetimes(energy_consumption_values[0].dates);

  //   energyConsumptionUnit =
  //     energy_consumption_values && energy_consumption_values[0].units;

  //   energyConsumptionValuesTableDataClone =
  //     energy_consumption_values &&
  //     energy_consumption_values.map((eachDevice) => {
  //       return {
  //         [eachDevice.deviceName]: eachDevice.value,
  //       };
  //     });

  //   allDates =
  //     energy_consumption_values && energy_consumption_values[0].dates;

  //   tableEnergyConsumptionValues =
  //     energyConsumptionValuesTableDataClone &&
  //     Object.assign(...energyConsumptionValuesTableDataClone);

  //   tableHeadings = Object.keys({
  //     date: '',
  //     time: '',
  //     ...tableEnergyConsumptionValues,
  //   });

  //   tableValues = Object.values({
  //     date: allDates && formatParametersDates(allDates),
  //     time: allDates && formatParametersTimes(allDates),
  //     ...tableEnergyConsumptionValues,
  //   });

  //   formattedTableData = formatParameterTableData(
  //     tableHeadings,
  //     tableValues
  //   );

  //   dataForEnergyConsumptionColumns =
  //     formattedTableData &&
  //     formattedTableData.map((eachRow) => {

  //       return eachRow;
  //     });

  //   deviceNames =
  //     dataForEnergyConsumptionColumns.length &&
  //     Object.keys(dataForEnergyConsumptionColumns[0]);

  //   energyConsumptionColumns =
  //     deviceNames &&
  //     deviceNames.map((eachName) => {
  //       return {
  //         label: `${eachName}`,
  //         key: `${eachName}`,
  //       };
  //     });
  //   csvHeaders = energyConsumptionColumns
  // }
  
  if (useEnergyConsumptionData.length > 0) {
    chartConsumptionValues =
      useEnergyConsumptionData.map((eachDevice) => eachDevice.value);

    allDeviceNames =
      useEnergyConsumptionData &&
      useEnergyConsumptionData.map((eachDevice) => eachDevice.name);
      const dateObjects = useEnergyConsumptionData && 
      convertDateStringsToObjects(useEnergyConsumptionData.find(device => device.name === "UTILITY").dates || useEnergyConsumptionData[0].dates);
      
    chartDates = dateObjects && formatParametersDatetimes(dateObjects);

    energyConsumptionUnit =
      useEnergyConsumptionData && useEnergyConsumptionData[0].units

    energyConsumptionValuesTableDataClone =
      useEnergyConsumptionData &&
      useEnergyConsumptionData.map((eachDevice) => {
        return {
          [eachDevice.name]: eachDevice.value,
        };
      });

    allDates =
      useEnergyConsumptionData && useEnergyConsumptionData[0].dates;

    tableEnergyConsumptionValues =
      energyConsumptionValuesTableDataClone &&
      Object.assign(...energyConsumptionValuesTableDataClone);

    tableHeadings = Object.keys({
      date: '',
      time: '',
      ...tableEnergyConsumptionValues,
    });

    tableValues = Object.values({
      date: chartDates,
      time: chartDates,
      ...tableEnergyConsumptionValues,
    });

    formattedTableData = formatParameterTableData(
      tableHeadings,
      tableValues
    );

    dataForEnergyConsumptionColumns =
      formattedTableData &&
      formattedTableData.map((eachRow) => {

        return eachRow;
      });

    deviceNames =
      dataForEnergyConsumptionColumns &&
      Object.keys(dataForEnergyConsumptionColumns[0]);

    energyConsumptionColumns =
      deviceNames &&
      deviceNames.map((eachName) => {
        return {
          label: `${eachName}`,
          key: `${eachName}`,
        };
      });
    csvHeaders = energyConsumptionColumns
  }

  // const csvHeaders = [
  //   { label: "Index", key: "index" },
  //   { label: "Date", key: "date" },
  //   { label: "time", key: "time" },
  //   { label: "Richmond Gate IPP", key: "Richmond Gate IPP" },
  //   { label: "Meadow hall Schools MEADOW HALL IPP", key: "Meadow hall Schools MEADOW HALL IPP" }
  // ]

  if (!useEnergyConsumptionData || useEnergyConsumptionData.length  === 0) {
    return <Loader />;
  }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      { chartDates &&
        <>
          <article className='parameters-stacked-bar-container'>
            <EnergyConsumptionBarChart
              chartConsumptionValues={chartConsumptionValues}
              chartDeviceNames={allDeviceNames}
              chartDates={chartDates}
              energyConsumptionUnit={energyConsumptionUnit}
            />
          </article>

          <div className='energy-consumption-middle-cards-container'>
            <p className='energy-consumption-middle-card'>
              <span className='energy-consumption-middle-card-heading'>
                Previous
              </span>
              <span className='energy-consumption-middle-card-body'>
                {numberFormatter(energy_consumption_previous)}kWh
              </span>
            </p>
            <p className='energy-consumption-middle-card'>
              <span className='energy-consumption-middle-card-heading'>
                Current
              </span>
              <span className='energy-consumption-middle-card-body'>
                {numberFormatter(energy_consumption_current)}kWh
              </span>
            </p>
            <p className='energy-consumption-middle-card'>
              <span className='energy-consumption-middle-card-heading'>Usage</span>
              <span className='energy-consumption-middle-card-body'>
                {numberFormatter(energy_consumption_usage)}kWh
              </span>
            </p>
          </div>

          <article className='table-with-header-container'>
            <div className='table-header'>
              <div className='h-hidden-medium-down'>
                {/* <button type='button' className='table-header__left-button'>
              PDF
            </button> */}
                <ExportToCsv filename={"energy-consumption-logs.csv"} csvData={formattedTableData} csvHeaders={csvHeaders}>
                  <button type='button' className='table-header__left-button'>
                    CSV
                  </button>
                </ExportToCsv>
              </div>

              <h3 className='table-header__heading'>Raw Logs</h3>

              <button
                type='button'
                className='table-header__right-button h-hidden-medium-down'
              >
                <ExcelIcon />
                <span>Download in Excel</span>
              </button>
            </div>

            <div className='energy-consumption-table-wrapper'>
              <EnergyConsumptionTable
                energyConsumptionUnit={energyConsumptionUnit}
                energyConsumptionData={formattedTableData}
              />
            </div>
          </article>
        </>}
    </>
  );
}

const mapDispatchToProps = {
  fetchEnergyConsumptionData
};
const mapStateToProps = (state) => ({
  parameters: state.parametersReducer,
  sideBar: state.sideBar,
  powerFactor: state.powerFactor,
  dashboard: state.dashboard,
}
);

export default connect(mapStateToProps, mapDispatchToProps)(EnergyConsumption);