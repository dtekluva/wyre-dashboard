import React, { useEffect, useState, useContext } from 'react';

import CompleteDataContext from '../Context';

import branchesHttpServices from '../services/userBranches';

import BreadCrumb from '../components/BreadCrumb';
import UserBranchesTable from '../components/tables/userViewOfBranchesDevicesAndUsersTables/UserBranchesTable';
import UserDevicesTable from '../components/tables/userViewOfBranchesDevicesAndUsersTables/UserDevicesTable';
import ListOfUsersTable from '../components/tables/userViewOfBranchesDevicesAndUsersTables/ListOfUsersTable';


import ExcelIcon from '../icons/ExcelIcon';

const breadCrumbRoutes = [
  { url: '/', name: 'Home', id: 1 },
  { url: '#', name: 'Overview', id: 2 },
];

function BranchesDevicesAndUsers({ match }) {
  const { setCurrentUrl } = useContext(CompleteDataContext);
  const [allBranches, setAllBranches] = useState([]);
  const [allDevices, setAllDevices] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (match && match.url) {
      setCurrentUrl(match.url);
    }
  }, [match, setCurrentUrl]);

  useEffect(() => {
    branchesHttpServices.getAll('branches').then((returnedData) => {
      setAllBranches(returnedData);
    });
    branchesHttpServices.getAll('devices').then((returnedData) => {
      setAllDevices(returnedData);
    });
    branchesHttpServices.getAll('users').then((returnedData) => {
      setAllUsers(returnedData);
    });
  }, []);


  return (
    <>
      <div className='breadcrumb-and-print-buttons'>
        <BreadCrumb routesArray={breadCrumbRoutes} />
      </div>

      <article className='table-with-header-container h-no-mt'>
        <div className='table-header'>
          <div className='h-hidden-medium-down'>
            {/* <button type='button' className='table-header__left-button'>
              PDF
            </button> */}
            <button type='button' className='table-header__left-button'>
              CSV
            </button>
          </div>

          <h3 className='table-header__heading'>Branches</h3>

          <button
            type='button'
            className='table-header__right-button h-hidden-medium-down'
          >
            <ExcelIcon />
            <span>Download in Excel</span>
          </button>
        </div>

        <div className='h-overflow-auto'>
          <UserBranchesTable listOfBranchesData={allBranches} />
        </div>
      </article>

      <article className='table-with-header-container'>
        <div className='table-header'>
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
          <UserDevicesTable listOfDevicesData={allDevices} />
        </div>
      </article>

      <article className='table-with-header-container'>
        <div className='table-header'>
          <div className='h-hidden-medium-down'>
            {/* <button type='button' className='table-header__left-button'>
              PDF
            </button> */}
            <button type='button' className='table-header__left-button'>
              CSV
            </button>
          </div>

          <h3 className='table-header__heading'>Users</h3>

          <button
            type='button'
            className='table-header__right-button h-hidden-medium-down'
          >
            <ExcelIcon />
            <span>Download in Excel</span>
          </button>
        </div>

        <div className='h-overflow-auto'>
          <ListOfUsersTable listOfUsersData={allUsers} />
        </div>
      </article>
    </>
  );
}

export default BranchesDevicesAndUsers;
