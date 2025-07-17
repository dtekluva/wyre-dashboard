import React, { useContext } from 'react';
import CompleteDataContext from '../../Context';

import {
  toSnakeCase,
  formatParametersDatetimes,
  formatParametersDates,
  formatParametersTimes,
  formatParameterTableData,
  convertDateStringsToObjects,
} from '../../helpers/genericHelpers';

import PowerQualityLineChart from '../lineCharts/PowerQualityLineChart';
import PowerQualityTable from '../tables/PowerQualityTable';

import ExcelIcon from '../../icons/ExcelIcon';
import ExportToCsv from '../ExportToCsv';

function PowerQualityPageSection({ pqData }) {
  // Obtain selected unit from context API
  const { powerQualityUnit } = useContext(CompleteDataContext);
  // Remove stuff in parenthesis then covert string to snake case
  const formattedPowerQualityName = toSnakeCase(
    powerQualityUnit.replace(/\s*\(.*?\)\s*/g, '')
  );

  // Pick out data based on selection in UI
  const plottedData = pqData && pqData[formattedPowerQualityName];
  const dateObjects = pqData && convertDateStringsToObjects(pqData.dates);
  const plottedDates = dateObjects && formatParametersDatetimes(dateObjects);

  // Clone plotted data for usage in table
  const tableData = Object.assign({}, plottedData);
  if (tableData) {
    delete tableData.units;
    delete tableData.deviceName;
  }

  const tableDates = dateObjects && formatParametersDates(dateObjects);
  const tableTimes = dateObjects && formatParametersTimes(dateObjects);

  const { frequency } = pqData || { frequency: ['Empty'] };
  if (frequency) {
    delete frequency.units;
  }

  const { power_factor } = pqData || { power_factor: ['Empty'] };
  if (power_factor) {
    delete power_factor.units;
  }

  const tableHeadings = Object.keys({
    date: tableDates,
    time: tableTimes,
    ...tableData,
    frequency: frequency && frequency.average,
    power_factor: power_factor && power_factor.l1_l2_l3,
  });

  const tableValues = Object.values({
    date: tableDates,
    time: tableTimes,
    ...tableData,
    frequency: frequency && frequency.average,
    power_factor: power_factor && power_factor.l1_l2_l3,
  });

  const formattedTableData = formatParameterTableData(
    tableHeadings,
    tableValues
  );


  // const csvHeaders = formattedTableData && Object.keys(formattedTableData[0]).map(key => ({
  //   label: "",
  //   key: key
  // }))

  const csvHeaders = [
    { label: "Index", key: "index" },
    { label: "Date", key: "date" },
    { label: "Time", key: "time" },
    { label: "Line 1", key: "l1" },
    { label: "Line 2", key: "l2" },
    { label: "Line 3", key: "l3" },
    { label: "Neutral", key: "neutral" },
    { label: "Frequency", key: "frequency" },
    { label: "Power Factor", key: "power_factor" }
  ]

  return (
    <section className='parameter-section'>
      <h2 className='parameter-section__heading'>
        {pqData && pqData.deviceName}
      </h2>

      <article className='power-quality-line-container'>
        <PowerQualityLineChart
          data={plottedData}
          dates={plottedDates}
          powerQualityUnit={powerQualityUnit}
        />
      </article>

      <article className='power-quality-table-container'>
        <div className='table-header'>
          <div className='h-hidden-medium-down'>
            {/* <button type='button' className='table-header__left-button'>
              PDF
            </button> */}
            <ExportToCsv filename={`${pqData && pqData.deviceName} power-quality.csv`} csvHeaders={csvHeaders} csvData={formattedTableData}>
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

        <div className='h-overflow-auto'>
          <PowerQualityTable
            powerQualityUnit={plottedData && plottedData.units}
            powerQualityData={formattedTableData}
          />
        </div>
      </article>
    </section>
  );
}

export default PowerQualityPageSection;