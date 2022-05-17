import React, { useEffect, useState, useContext } from 'react';

import CompleteDataContext from '../Context';

import adminHttpServices from '../services/admin';

import BreadCrumb from '../components/BreadCrumb';
import AdminDevicesTable from '../components/tables/adminTables/AdminDevicesTable';


import ExcelIcon from '../icons/ExcelIcon';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Manage', id: 2 },
  { url: '#', name: 'View Branches', id: 3 },
];

function ViewDevices({ match }) {
  const { setCurrentUrl } = useContext(CompleteDataContext);
  const [adminDevicesData, setAdminDevicesData] = useState([]);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    adminHttpServices.getAll('devices').then((returnedData) => {
      setAdminDevicesData(returnedData);
    });
  }, []);

  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <article className='table-with-header-container h-no-mt'>
        <div className='table-header h-border-bottom'>
          <div className='h-hidden-medium-down'>
            {/* <button type='button' className='table-header__left-button'>
              PDF
            </button> */}
            <button type='button' className='table-header__left-button'>
              CSV
            </button>
          </div>

          <h3 className='table-header__heading'>Devices</h3>

          <button
            type='button'
            className='table-header__right-button h-hidden-medium-down'
          >
            <ExcelIcon />
            <span>Download in Excel</span>
          </button>
        </div>

        <div className='h-overflow-auto'>
          <AdminDevicesTable listOfDevicesData={adminDevicesData} />
        </div>
      </article>
    </>
  );
}

export default ViewDevices;
