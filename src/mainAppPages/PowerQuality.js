import React, { useEffect, useContext, useState } from 'react';

import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';
import PowerQualityPageSection from '../components/parameterPagesSections/PowerQualityPageSection';
import Loader from '../components/Loader';
import { fetchPowerQualityData } from '../redux/actions/parameters/parameter.action';
import { connect, useSelector } from 'react-redux';
import { devicesArray } from '../helpers/v2/organizationDataHelpers';
import { isEmpty } from '../helpers/authHelper';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Parameters', id: 2 },
  { url: '#', name: 'Power Quality', id: 3 },
];

function PowerQuality({ match, fetchPowerQualityData }) {
  const [powerQualityData, setPowerQualityData] = useState([]);
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
    fetchPowerQualityData(userDateRange)
  }, []);

  useEffect(() => {
    if (!pageLoaded && isEmpty(parametersData || {})) {
      fetchPowerQualityData(userDateRange);
    }

    if (!isEmpty(parametersData) > 0 && pageLoaded) {
      fetchPowerQualityData(userDateRange);
    }
    setPageLoaded(true);
  }, [userDateRange]);
  
  useEffect(() => {
    if (pageLoaded && parametersData.fetchedPowerQuality) {
      let openDevicesArrayData
      const devicesArrayData = devicesArray(parametersData.fetchedPowerQuality.authenticatedData, checkedBranchId, checkedDevicesId);
      openDevicesArrayData = devicesArrayData && devicesArrayData.devices.map(eachDevice => eachDevice)
      setPowerQualityData(openDevicesArrayData)
    }
    setPageLoaded(true);
  }, [parametersData.fetchedPowerQuality, checkedBranchId, checkedDevicesId.length]);
  
  const power_quality = powerQualityData.map(eachDevice => {
    const {name, power_quality} = eachDevice
    const {active_power, current, dates:{dates}, frequency, power_factor, power_factor123, reactive_power, voltage} = power_quality
    return {name, active_power, current, dates, frequency, power_factor, power_factor123, reactive_power, voltage}
  })

  const powerQualitySections =
    power_quality &&
    power_quality.map((eachDevice) => (
      <PowerQualityPageSection
        key={eachDevice.deviceName}
        pqData={eachDevice}
      />
    ));
  
   if (!power_quality || power_quality.length  === 0) {
     return <Loader />;
   }

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div>{powerQualitySections}</div>
    </>
  );
}

const mapDispatchToProps = {
  fetchPowerQualityData
};
const mapStateToProps = (state) => ({
  parameters: state.parametersReducer,
  sideBar: state.sideBar,
  powerFactor: state.powerFactor,
  dashboard: state.dashboard,
}
);

export default connect(mapStateToProps, mapDispatchToProps)(PowerQuality);