import React, { useEffect, useContext, useState } from 'react';

import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';
import LastReadingPageSection from '../components/parameterPagesSections/LastReadingPageSection';
import Loader from '../components/Loader';
import { fetchLastReadingData } from '../redux/actions/parameters/parameter.action';
import { devicesArray } from '../helpers/v2/organizationDataHelpers';
import { connect, useSelector } from 'react-redux';
import { isEmpty } from '../helpers/authHelper';
import moment from "moment";

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Parameters', id: 2 },
  { url: '#', name: 'Last Reading', id: 3 },
];

function LastReading({ match, fetchLastReadingData }) {
  const [lastReadingData, setLastReadingData] = useState([]);
  const [pageLoaded, setPageLoaded] = useState(false);
  const parametersData = useSelector((state) => state.parametersReducer);

  const {
    // userDateRange,
    checkedBranchId,
    checkedDevicesId,
    refinedRenderedData,
    setCurrentUrl,
    isAuthenticatedDataLoading,
  } = useContext(CompleteDataContext);

  const singleDateToUse = moment().format("DD-MM-YYYY HH:mm");

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    fetchLastReadingData(singleDateToUse)
  }, []);
  
  useEffect(() => {
    if (!pageLoaded && isEmpty(parametersData || {})) {
      fetchLastReadingData(singleDateToUse);
    }

    if (!isEmpty(parametersData) > 0 && pageLoaded) {
      fetchLastReadingData(singleDateToUse);
    }
    setPageLoaded(true);
  }, [singleDateToUse]);

  useEffect(() => {
    if (pageLoaded && parametersData.fetchedLastReading) {
      let openDevicesArrayData
      const devicesArrayData = devicesArray(parametersData.fetchedLastReading, checkedBranchId, checkedDevicesId);
      openDevicesArrayData = devicesArrayData && devicesArrayData.devices.map(eachDevice => eachDevice)
      setLastReadingData(openDevicesArrayData)
    }
      setPageLoaded(true);
  }, [parametersData.fetchedLastReading, checkedBranchId, checkedDevicesId.length]);

  // const { last_reading } = refinedRenderedData;

  const last_reading = lastReadingData.map(eachDevice => {
    const {name, last_reading} = eachDevice
    const {data, date} = last_reading
    return {name, data, date}
  })

  const lastReadingSections =
    last_reading &&
    last_reading.map((eachDevice) => (
      <LastReadingPageSection key={eachDevice.deviceName} lrData={eachDevice} />
    ));
  
   if (!lastReadingData.length > 0) {
     return <Loader />;
   }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      {lastReadingSections}
    </>
  );
}

const mapDispatchToProps = {
  fetchLastReadingData
};
const mapStateToProps = (state) => ({
  parameters: state.parametersReducer,
  sideBar: state.sideBar,
  powerFactor: state.powerFactor,
  dashboard: state.dashboard,
}
);

export default connect(mapStateToProps, mapDispatchToProps)(LastReading);