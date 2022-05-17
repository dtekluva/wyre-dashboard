import React, { useEffect, useContext } from 'react';
import CompleteDataContext from '../Context';

import {
  formatParametersDatetimes,
  formatParametersDates,
  formatParameterTableData,
  convertDateStringsToObjects,
} from '../helpers/genericHelpers';

import BreadCrumb from '../components/BreadCrumb';
import TimeOfUseStackedBarChart from '../components/barCharts/TimeOfUseStackedBarChart';
import TimeOfUseTable from '../components/tables/TimeOfUseTable';
import Loader from '../components/Loader';

import TimeOfUseCard from '../smallComponents/TimeOfUseCard'
import ExcelIcon from '../icons/ExcelIcon';
import ExportToCsv from '../components/ExportToCsv';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Parameters', id: 2 },
  { url: '#', name: 'Time of Use', id: 3 },
];

function TimeOfUse({ match }) {
  const {
    refinedRenderedData,
    setCurrentUrl,
    isAuthenticatedDataLoading,
    organization
  } = useContext(CompleteDataContext);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  const { time_of_use_chart, time_of_use_table } = refinedRenderedData;

  const chartTimeValues =
    time_of_use_chart &&
    time_of_use_chart.map((eachDevice) => eachDevice.values);

  const chartDeviceNames =
    time_of_use_chart &&
    time_of_use_chart.map((eachDevice) => eachDevice.deviceName);

  const chartDates =
    time_of_use_chart && formatParametersDatetimes(time_of_use_chart[0].dates);

  // Convert datestrings to date objects
  const timeOfUseTableDataWithDateObjects =
    time_of_use_table &&
    time_of_use_table.map((eachBranch) => {
      const { dates } = eachBranch;
      // const dateObjects = convertDateStringsToObjects(dates.dates || dates);
      // const branchWithDateObjects = { ...eachBranch, dates: dateObjects };
      // return branchWithDateObjects;
    });

  const tableHeadings = Object.keys({
    branchName: '',
    date: '',
    // ...(timeOfUseTableDataWithDateObjects
    //   ? timeOfUseTableDataWithDateObjects[0].values
    //   : []),
  });

  const arrayOfTableValues =
    timeOfUseTableDataWithDateObjects &&
    timeOfUseTableDataWithDateObjects.map((eachBranch) => {
      return Object.values({
        // branchName: [eachBranch.branchName],
        // date: formatParametersDates(eachBranch.dates),
        // ...eachBranch.values,
      });
    });

  const arrayOfFormattedTableData =
    arrayOfTableValues &&
    arrayOfTableValues.map((eachBranchTableValues) =>
      formatParameterTableData(tableHeadings, eachBranchTableValues)
    );

  const csvTitles = organization.branches && organization.branches[0].time_of_use_table.titles
  // console.log(csvTitles)
  const csvHeaders = [
    // organization.branches && organization.branches.map((data)=>[{ label: data && data.time_of_use_table.titles, key: data && data.time_of_use_table.titles }])
    { label: "post_datetime", key: "post_datetime" },
    { label: "EKEDC", key: "EKEDC" },
    { label: "EKEDC_hours", key: "EKEDC_hours" },
    { label: "EKEDC_hou_cummlative", key: "EKEDC_hou_cummlative" },
    { label: "350KVA GEN", key: "350KVA GEN" },
    { label: "350KVA GEN_hours", key: "350KVA GEN_hours" },
    { label: "350KVA GEN_hou_cummlative", key: "350KVA GEN_hou_cummlative" },
  ]

  if (isAuthenticatedDataLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      {/* <article className='parameters-stacked-bar-container'>
        <TimeOfUseStackedBarChart
          chartTimeValues={chartTimeValues}
          chartDeviceNames={chartDeviceNames}
          chartDates={chartDates}
        />
      </article> */}

      {organization.branches && organization.branches.map((eachBranch) => (
        <>
          <TimeOfUseCard data={eachBranch} />
          <article className='table-with-header-container'>
            <div className='table-header'>
              <div className='h-hidden-medium-down'>
                {/* <button type='button' className='table-header__left-button'>
                  PDF
                </button> */}
                <ExportToCsv filename={`${eachBranch.name} time-of-use.csv`} csvHeaders={csvHeaders} csvData={eachBranch.time_of_use_table.values}>
                  <button type='button' className='table-header__left-button'>
                    CSV
                  </button>
                </ExportToCsv>
              </div>

              <h3 className='table-header__heading'>
                Raw Logs for {eachBranch.name}
              </h3>

              <button
                type='button'
                className='table-header__right-button h-hidden-medium-down'
              >
                <ExcelIcon />
                <span>Download in Excel</span>
              </button>
            </div>

            <div className='time-of-use-table-wrapper'>
              <TimeOfUseTable timeOfUseData={eachBranch} />
            </div>
          </article>
        </>
      ))
      }
    </>
  );
}

export default TimeOfUse;
