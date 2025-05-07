import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Select } from 'antd';
import { useSelector } from 'react-redux';

import CompleteDataContext from '../Context';

import dataHttpServices from '../services/devices';


import { CaretDownFilled } from '@ant-design/icons';
import NewAppTopBar from './NewAppTopBar';
import SwitchablePicker from './headers/SwitchablePicker';

const { Option } = Select;

function RevisedAppTopBar() {
  const {
    isSidebarOpen,
    currentUrl,
    setPowerQualityUnit,
    setParametersDataTimeInterval,
  } = useContext(CompleteDataContext);

  const sideBarData = useSelector((state) => state.sideBar.sideBarData);
  const pagesWithDateTimePickers = [
    'dashboard',
    'score-card',
    'parameters',
    'cost-tracker',
    'billing',
    'load-overview',
  ];

  const pagesWithTimeIntervalSelector = [
    'energy-consumption',
    'power-quality',
    'power-demand',
    'time-of-use',
  ];

  const pageWithSwitchablePicker = [
    'report',
  ];

  const isDateTimePickerDisplayed = pagesWithDateTimePickers.some((page) =>
    currentUrl.includes(page)
  );

  const isTimeIntervalSelectorDisplayed = pagesWithTimeIntervalSelector.some(
    (page) => currentUrl.includes(page)
  );

  const isPageWithSwitchableSelector = pageWithSwitchablePicker.some(
    (page) => currentUrl.includes(page)
  );

  const isDateTimePickerDisabled = currentUrl.includes('last-reading');

  const isPlottedUnitSelectorDisplayed = currentUrl.includes('power-quality');

  const isTopBarCostTrackerRightDisplayed = currentUrl.includes('cost-tracker') || currentUrl.includes('dashboard') ;

  const isTopBarUserBranchesRightDisplayed =
    currentUrl.includes('branches') && !currentUrl.includes('user-form');

  const handleIntervalChange = (interval) => {
    setParametersDataTimeInterval(interval);
    dataHttpServices.setEndpointDataTimeInterval(interval);
  };

  const handleUnitChange = (unit) => {
    setPowerQualityUnit(unit);
  };

  return (
    <div className={isSidebarOpen ? 'top-bar' : 'top-bar h-hidden-medium-down'}>
      <div className='top-bar__left'>
        <div className={isDateTimePickerDisplayed ? '' : 'h-hide'}>
          <NewAppTopBar />
        </div>

        <div
          className={
            isTimeIntervalSelectorDisplayed
              ? 'time-interval-selector-container'
              : 'time-interval-selector-container h-hide'
          }
        >
          <Select
            className='time-interval-selector h-8-br'
            defaultValue='hourly'
            onChange={handleIntervalChange}
            suffixIcon={<CaretDownFilled />}
          >
            <Option className='time-interval-option' value='15mins'>
              15Mins
            </Option>
            <Option className='time-interval-option' value='30mins'>
              30Mins
            </Option>
            <Option className='time-interval-option' value='hourly'>
              Hourly
            </Option>
            <Option className='time-interval-option' value='daily'>
              Daily
            </Option>
            <Option className='time-interval-option' value='weekly'>
              Weekly
            </Option>
            <Option className='time-interval-option' value='monthly'>
              Monthly
            </Option>
          </Select>
        </div>
        <div
          className={
            isPageWithSwitchableSelector
              ? 'switch-table-picker-container'
              : 'switch-table-picker-container h-hide'
          }
        >
          <SwitchablePicker />
        </div>
        <div
          className={
            isPlottedUnitSelectorDisplayed
              ? 'plotted-unit-selector-container'
              : 'plotted-unit-selector-container h-hide'
          }
        >
          <Select
            className='plotted-unit-selector h-8-br'
            defaultValue='Current (Amps)'
            suffixIcon={<CaretDownFilled />}
            onChange={handleUnitChange}
          >
            <Option className='plotted-unit-option' value='Current (Amps)'>
              Current (Amps)
            </Option>
            <Option className='plotted-unit-option' value='Voltage (Volts)'>
              Voltage (Volts)
            </Option>
            <Option className='plotted-unit-option' value='Active-Power (kW)'>
              Active-Power (kW)
            </Option>
            <Option
              className='plotted-unit-option'
              value='Reactive-Power (kVar)'
            >
              Reactive-Power (kVar)
            </Option>
            {/* <Option className='plotted-unit-option' value='Energy (kWh)'>
              Energy (kWh)
            </Option> */}
          </Select>
        </div>
      </div>

      {sideBarData.branches && sideBarData.branches.length === 1 ?
        <div
          className={
            isTopBarCostTrackerRightDisplayed
              ? 'top-bar__right'
              : 'top-bar__right h-hide'
          }
        >
          <Link className='top-bar-right__button' to='/cost-tracker/add-bills'>
            Add Bills
          </Link>
          <Link className='top-bar-right__button' to='/cost-tracker/add-diesel-entry'>
            Add Diesel Entry
          </Link>
          <Link
            className='top-bar-right__button'
            to='/cost-tracker/add-equipment'
          >
            Add Equipment
          </Link>
        </div>
        : null
      }
      <div
        className={
          isTopBarUserBranchesRightDisplayed
            ? 'top-bar__right'
            : 'top-bar__right h-hide'
        }
      >
        <Link
          className='top-bar-right__button h-extra-padding'
          to='/client-profile'
        >
          Edit Client
        </Link>
      </div>
    </div>
  );
}

export default RevisedAppTopBar;
