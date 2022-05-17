import React, { useEffect, useState, useContext } from 'react';

import CompleteDataContext from '../Context';

import adminHttpServices from '../services/admin';

import BreadCrumb from '../components/BreadCrumb';
import AdminOverviewTable from '../components/tables/adminTables/AdminOverviewTable';


import ExcelIcon from '../icons/ExcelIcon';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Admin Overview', id: 2 },
];

function Overview({ match }) {
  const { setCurrentUrl } = useContext(CompleteDataContext);
  const [adminOverviewData, setadminOverviewData] = useState([]);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(`${match.url} hide-top-bar`);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    adminHttpServices.getAll('overview').then((returnedData) => {
      setadminOverviewData(returnedData);
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

          <h3 className='table-header__heading'>Admin Overview</h3>

          <button
            type='button'
            className='table-header__right-button h-hidden-medium-down'
          >
            <ExcelIcon />
            <span>Download in Excel</span>
          </button>
        </div>

        <div className='h-overflow-auto'>
          <AdminOverviewTable overviewListData={adminOverviewData} />
        </div>
      </article>
    </>
  );
}

export default Overview;
