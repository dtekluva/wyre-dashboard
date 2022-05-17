import React, { useEffect, useContext } from 'react';
import CompleteDataContext from '../Context';
import { CSVLink } from "react-csv";
import { notification } from "antd"

import {
  formatParametersDatetimes,
  formatParametersDates,
  formatParametersTimes,
  formatParameterTableData,
} from '../helpers/genericHelpers';

import BreadCrumb from '../components/BreadCrumb';
import PowerDemandStackedBarChart from '../components/barCharts/PowerDemandStackedBarChart';
import PowerDemandTable from '../components/tables/PowerDemandTable';
import Loader from '../components/Loader';


import ExcelIcon from '../icons/ExcelIcon';
import ExportToCsv from '../components/ExportToCsv';
import { exportToExcel } from '../helpers/exportToFile';
import jsPDF from "jspdf";


const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Parameters', id: 2 },
  { url: '#', name: 'Power Demand', id: 3 },
];

function PowerDemand({ match }) {
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

  const { power_demand } = refinedRenderedData;



  let chartDemandValues, chartDates, chartDeviceNames, chartTooltipValues;
  let powerDemandUnit, powerDemandTableDataClone, arrayOfTableValues, formattedTableDataWithIndex;
  let tableHeadings, csvHeaders, XLSXHeaders, PDFHeaders, arrayOfFormattedTableData, formattedTableData;
  if (power_demand) {

    chartDemandValues =
      power_demand && power_demand.map((eachDevice) => eachDevice.demand);

    chartDeviceNames =
      power_demand && power_demand.map((eachDevice) => eachDevice.source);

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
      power_demand && formatParametersDatetimes(power_demand[0].dates);

    powerDemandUnit = power_demand && power_demand[0].units;

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
      ...(powerDemandTableDataClone ? powerDemandTableDataClone[0] : []),
    });

    arrayOfTableValues =
      powerDemandTableDataClone &&
      powerDemandTableDataClone.map((eachDevice) => {
        return Object.values({
          date: formatParametersDates(eachDevice.dates),
          time: formatParametersTimes(eachDevice.dates),
          ...eachDevice,
        });
      });

    arrayOfFormattedTableData =
      arrayOfTableValues &&
      arrayOfTableValues.map((eachDeviceTableValues) =>
        formatParameterTableData(tableHeadings, eachDeviceTableValues)
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

  if (isAuthenticatedDataLoading) {
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

export default PowerDemand;
