import { useEffect, useContext, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CompleteDataContext from '../Context';

import BreadCrumb from '../components/BreadCrumb';
import PowerQualityPageSection from '../components/parameterPagesSections/PowerQualityPageSection';
import Loader from '../components/Loader';

import { fetchPowerQualityData } from '../redux/actions/parameters/parameter.action';
import { devicesArray } from '../helpers/v2/organizationDataHelpers';
import { isEmpty } from '../helpers/authHelper';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Parameters', id: 2 },
  { url: '#', name: 'Power Quality', id: 3 },
];

function PowerQuality({ match }) {
  const dispatch = useDispatch();
  const parametersData = useSelector((state) => state.parametersReducer);

  const {
    userDateRange,
    checkedBranchId,
    checkedDevicesId,
    setCurrentUrl,
  } = useContext(CompleteDataContext);

  /* -------------------- set current url -------------------- */
  useEffect(() => {
    if (match?.url) {
      setCurrentUrl(match.url);
    }
  }, [match?.url, setCurrentUrl]);

  /* -------------------- fetch power quality data -------------------- */
  useEffect(() => {
    if (userDateRange) {
      dispatch(fetchPowerQualityData(userDateRange));
    }
  }, [dispatch, userDateRange]);

  /* -------------------- derive devices data -------------------- */
  const powerQualityData = useMemo(() => {
    if (
      isEmpty(parametersData?.fetchedPowerQuality) ||
      !parametersData?.fetchedPowerQuality?.authenticatedData
    ) {
      return [];
    }

    const devicesArrayData = devicesArray(
      parametersData.fetchedPowerQuality.authenticatedData,
      checkedBranchId,
      checkedDevicesId
    );

    return devicesArrayData?.devices || [];
  }, [
    parametersData?.fetchedPowerQuality,
    checkedBranchId,
    checkedDevicesId,
  ]);

  /* -------------------- normalize data for sections -------------------- */
  const powerQualitySectionsData = useMemo(
    () =>
      powerQualityData.map((eachDevice) => {
        const { name, power_quality } = eachDevice;
        const {
          active_power,
          current,
          dates: { dates },
          frequency,
          power_factor,
          power_factor123,
          reactive_power,
          voltage,
        } = power_quality;

        return {
          name,
          active_power,
          current,
          dates,
          frequency,
          power_factor,
          power_factor123,
          reactive_power,
          voltage,
        };
      }),
    [powerQualityData]
  );

  if (!powerQualitySectionsData.length) {
    return <Loader />;
  }

  return (
    <>
      <div className="breadcrumb-and-print-buttons">
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <div>
        {powerQualitySectionsData.map((eachDevice) => (
          <PowerQualityPageSection
            key={eachDevice.name}
            pqData={eachDevice}
          />
        ))}
      </div>
    </>
  );
}

export default PowerQuality;