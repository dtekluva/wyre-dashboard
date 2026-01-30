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
  const { powerQualityUnit } = useContext(CompleteDataContext);

  const formattedPowerQualityName = toSnakeCase(
    powerQualityUnit.replace(/\s*\(.*?\)\s*/g, '')
  );

  const plottedData = pqData?.[formattedPowerQualityName];
  const dateObjects =
    pqData?.dates && convertDateStringsToObjects(pqData.dates);
  const plottedDates =
    dateObjects && formatParametersDatetimes(dateObjects);

  /* ---------- clone data safely for table ---------- */
  const tableData = plottedData
    ? Object.fromEntries(
        Object.entries(plottedData).filter(
          ([key]) => key !== 'units' && key !== 'deviceName'
        )
      )
    : {};

  const tableDates =
    dateObjects && formatParametersDates(dateObjects);
  const tableTimes =
    dateObjects && formatParametersTimes(dateObjects);

  const frequency = pqData?.frequency
    ? { ...pqData.frequency }
    : null;

  const powerFactor = pqData?.power_factor
    ? { ...pqData.power_factor }
    : null;

  const tableHeadings = Object.keys({
    date: tableDates,
    time: tableTimes,
    ...tableData,
    frequency: frequency?.average,
    power_factor: powerFactor?.l1_l2_l3,
  });

  const tableValues = Object.values({
    date: tableDates,
    time: tableTimes,
    ...tableData,
    frequency: frequency?.average,
    power_factor: powerFactor?.l1_l2_l3,
  });

  const formattedTableData = formatParameterTableData(
    tableHeadings,
    tableValues
  );

  const csvHeaders = [
    { label: 'Index', key: 'index' },
    { label: 'Date', key: 'date' },
    { label: 'Time', key: 'time' },
    { label: 'Line 1', key: 'l1' },
    { label: 'Line 2', key: 'l2' },
    { label: 'Line 3', key: 'l3' },
    { label: 'Neutral', key: 'neutral' },
    { label: 'Frequency', key: 'frequency' },
    { label: 'Power Factor', key: 'power_factor' },
  ];

  return (
    <section className="parameter-section">
      <h2 className="parameter-section__heading">
        {pqData?.name}
      </h2>

      <article className="power-quality-line-container">
        <PowerQualityLineChart
          data={plottedData}
          dates={plottedDates}
          powerQualityUnit={powerQualityUnit}
        />
      </article>

      <article className="power-quality-table-container">
        <div className="table-header">
          <div className="h-hidden-medium-down">
            <ExportToCsv
              filename={`${pqData?.name || 'device'}-power-quality.csv`}
              csvHeaders={csvHeaders}
              csvData={formattedTableData}
            >
              <button
                type="button"
                className="table-header__left-button"
              >
                CSV
              </button>
            </ExportToCsv>
          </div>

          <h3 className="table-header__heading">Raw Logs</h3>

          <button
            type="button"
            className="table-header__right-button h-hidden-medium-down"
          >
            <ExcelIcon />
            <span>Download in Excel</span>
          </button>
        </div>

        <div className="h-overflow-auto">
          <PowerQualityTable
            powerQualityUnit={plottedData?.units}
            powerQualityData={formattedTableData}
          />
        </div>
      </article>
    </section>
  );
}

export default PowerQualityPageSection;