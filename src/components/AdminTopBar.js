import React, { useContext, useState } from 'react';
import CompleteDataContext from '../Context';
import { Link } from 'react-router-dom';
import { Input, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import AddDeviceForm from '../adminPages/modal/AddDeviceForm';
import AddUserForm from '../adminPages/modal/AddUserForm';

function TopBar() {
  // modal functions for add user form and add device form starts 
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  // modal functions ends 

  const { isSidebarOpen, currentUrl } = useContext(CompleteDataContext);

  const isTopBarAdminOrganisationRightDisplayed = currentUrl.includes(
    'view-client'
  );

  const isTopBarAdminDeviceRightDisplayed = currentUrl.includes('view-devices');
  const isTopBarAdminDeviceRightDisplayed2 = currentUrl.includes('view-branches');
  const isTopBarAdminDeviceLeftDisplayed = currentUrl.includes('view-branches');
  const isTopBarAdminDeviceRightDisplayed3 = currentUrl.includes('view-branch');


  const isTopBarDisplayed = !currentUrl.includes('hide-top-bar');

  return (
    <div className={isTopBarDisplayed ? 'displayed' : 'h-hidden-medium-up'}>
      <div
        className={isSidebarOpen ? 'top-bar' : 'top-bar h-hidden-medium-down'}
      >
        <div className={isTopBarAdminDeviceLeftDisplayed ? '.top-bar__left' : '.top-bar__left h-hide'}>
          <div className="search_input-wrapper">
            <Input className='search___input' placeholder="Branches" prefix={<SearchOutlined />} />
          </div>
        </div>
        <div></div>

        <div
          className={
            isTopBarAdminOrganisationRightDisplayed
              ? 'top-bar__right'
              : 'top-bar__right h-hide'
          }
        >
          <Link className='top-bar-right__button h-extra-padding' to='/add-clients' >
            Add Client
          </Link>

        </div>

        <div
          className={
            isTopBarAdminDeviceRightDisplayed
              ? 'top-bar__right'
              : 'top-bar__right h-hide'
          }
        >
          <Link
            className='top-bar-right__button h-extra-padding'
            to='/add-devices'
          >
            Add Device
          </Link>
        </div>
        <div
          className={
            isTopBarAdminDeviceRightDisplayed2
              ? 'top-bar__right'
              : 'top-bar__right h-hide'
          }
        >
          <Link
            className='top-bar-right__button h-extra-padding'
            to='/compare-branches'
          >
            Compare
          </Link>
          <Link
            className='top-bar-right__button h-extra-padding'
            to='/add-branches'
          >
            Add Branch
          </Link>
        </div>
        <div
          className={
            isTopBarAdminDeviceRightDisplayed3
              ? 'top-bar__right'
              : 'top-bar__right h-hide'
          }
        >
          <Link
            className='top-bar-right__button h-extra-padding'
            onClick={() => setVisible2(true)}
          >
            Add User
          </Link>
          <Link
            className='top-bar-right__button h-extra-padding'
            onClick={() => setVisible(true)}
          >
            Add Device
          </Link>
        </div>
      </div>
      {/* Add Device Form modal  */}
      <Modal visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)} width={1000} footer={null} >
        <AddDeviceForm />
      </Modal>

      {/* Add User Form modal  */}
      <Modal visible={visible2}
        onOk={() => setVisible2(false)}
        onCancel={() => setVisible2(false)} width={1000} footer={null} >
        <AddUserForm />
      </Modal>
    </div>
  );
}

export default TopBar;
