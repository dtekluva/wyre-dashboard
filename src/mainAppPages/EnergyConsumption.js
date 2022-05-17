import React, { useEffect, useContext } from 'react';


import CompleteDataContext from '../Context';

import {
  formatParametersDatetimes,
  formatParametersDates,
  formatParametersTimes,
  formatParameterTableData,
} from '../helpers/genericHelpers';
import { numberFormatter } from "../helpers/numberFormatter"

import BreadCrumb from '../components/BreadCrumb';
import EnergyConsumptionBarChart from '../components/barCharts/EnergyConsumptionBarChart';
import EnergyConsumptionTable from '../components/tables/EnergyConsumptionTable';
import Loader from '../components/Loader';

import ExcelIcon from '../icons/ExcelIcon';
import ExportToCsv from '../components/ExportToCsv';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Parameters', id: 2 },
  { url: '#', name: 'Energy Consumption', id: 3 },
];

function EnergyConsumption({ match }) {
  const {
    refinedRenderedData,
    setCurrentUrl,
    isAuthenticatedDataLoading,
  } = useContext(CompleteDataContext);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const {
    energy_consumption_values,
    energy_consumption_current,
    energy_consumption_previous,
    energy_consumption_usage,
  } = refinedRenderedData;

  let chartConsumptionValues, allDeviceNames, chartDates, energyConsumptionUnit;
  let allDates, tableHeadings, formattedTableData, dataForEnergyConsumptionColumns;
  let deviceNames, energyConsumptionColumns, energyConsumptionValuesTableDataClone;
  let tableEnergyConsumptionValues, tableValues, csvHeaders;

  if (energy_consumption_usage && energy_consumption_values) {
    chartConsumptionValues =
      energy_consumption_values &&
      energy_consumption_values.map((eachDevice) => eachDevice.value);

    allDeviceNames =
      energy_consumption_values &&
      energy_consumption_values.map((eachDevice) => eachDevice.deviceName);

    chartDates =
      energy_consumption_values &&
      formatParametersDatetimes(energy_consumption_values[0].dates);

    energyConsumptionUnit =
      energy_consumption_values && energy_consumption_values[0].units;

    energyConsumptionValuesTableDataClone =
      energy_consumption_values &&
      energy_consumption_values.map((eachDevice) => {
        return {
          [eachDevice.deviceName]: eachDevice.value,
        };
      });

    allDates =
      energy_consumption_values && energy_consumption_values[0].dates;

    tableEnergyConsumptionValues =
      energyConsumptionValuesTableDataClone &&
      Object.assign(...energyConsumptionValuesTableDataClone);

    tableHeadings = Object.keys({
      date: '',
      time: '',
      ...tableEnergyConsumptionValues,
    });

    tableValues = Object.values({
      date: allDates && formatParametersDates(allDates),
      time: allDates && formatParametersTimes(allDates),
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
      dataForEnergyConsumptionColumns.length &&
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



  // console.log(energyConsumptionColumns)

  // const csvHeaders = [
  //   { label: "Index", key: "index" },
  //   { label: "Date", key: "date" },
  //   { label: "time", key: "time" },
  //   { label: "Richmond Gate IPP", key: "Richmond Gate IPP" },
  //   { label: "Meadow hall Schools MEADOW HALL IPP", key: "Meadow hall Schools MEADOW HALL IPP" }
  // ]

  if (isAuthenticatedDataLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>
      {energy_consumption_usage && energy_consumption_values &&
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

export default EnergyConsumption;
