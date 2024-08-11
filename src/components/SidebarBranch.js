import React, { useState, useContext } from 'react';
import { useDispatch } from 'react-redux'
import { Checkbox } from 'antd';

import CompleteDataContext from '../Context';

import SidebarDevice from './SidebarDevice';

import ChevronDown from '../icons/ChevronDown';
import ChevronUp from '../icons/ChevronUp';

import { setSelectedSideBar } from '../redux/actions/sidebar/actionCreators';

import {
  toCamelCase,
  cloneObject,
  getModifiedBranchLevelData,
} from '../helpers/genericHelpers';
import { getRefinedBranchData } from '../helpers/branchDataHelpers';
import { connect } from 'react-redux';

function SidebarBranch({ branchData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const dispatch = useDispatch();

  const {
    renderedDataObjects,
    setRenderedDataObjects,
    checkedItems,
    setCheckedItems,
    checkedBranches,
    checkedBranchId,
    setCheckedBranches,
    setCheckedBranchId,
    checkedDevices,
    setCheckedDevicesId,
    checkedDevicesId
  } = useContext(CompleteDataContext);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };



  // Check if checkedDevices is empty
  const isAnyDeviceChecked =
    Object.keys(checkedDevices).length > 0 &&
    checkedDevices.constructor === Object;

  const Icon = isOpen ? (
    <ChevronUp className="h-white-fill-medium-up" />
  ) : (
    <ChevronDown className="h-white-fill-medium-up" />
  );

  const checkBoxName = toCamelCase(branchData.name);

  const deviceComponents =
    branchData.devices && isOpen
      ? branchData.devices.map((eachDevice) => {
        // Add parent branch name to make each device name unique
        const modifiedDeviceName = !eachDevice.name.includes(branchData.name)
          ? branchData.name + ' ' + eachDevice.name
          : eachDevice.name;

        // Creates name with parent branch name removed
        const originalDeviceName = eachDevice.name
          .replace(branchData.name, '')
          .trim();
        

        // const deviceDailyKwh = {
        //   dates: branchData.daily_kwh.dates,
        //   [modifiedDeviceName]: branchData.daily_kwh[originalDeviceName],
        // };

        // const branchMonthlyUsage = branchData.usage_hours;
        // const deviceIndex = branchMonthlyUsage.devices.indexOf(
        //   originalDeviceName
        // );
        // const deviceMonthlyUsage = {
        //   // Use modified device name
        //   devices: [
        //     branchData.name + ' ' + branchMonthlyUsage.devices[deviceIndex],
        //   ],
        //   hours: [branchMonthlyUsage.hours[deviceIndex]],
        // };

        // const modifiedBranchTimeOfUseTableData = getModifiedBranchLevelData(
        //   branchData,
        //   'time_of_use_table',
        //   branchData.name
        // );

        // const modifiedBranchCostTrackerDieselQuantityData = getModifiedBranchLevelData(
        //   branchData,
        //   'cost_tracker_qty_of_diesel',
        //   branchData.name
        // );

        // const modifiedBranchCostTrackerMonthlyCostData = getModifiedBranchLevelData(
        //   branchData,
        //   'cost_tracker_monthly_cost',
        //   branchData.name
        // );

        // const modifiedBranchCostTrackerConsumptionData = getModifiedBranchLevelData(
        //   branchData,
        //   'cost_tracker_consumption_breakdown',
        //   branchData.name
        // );

        // const modifiedBranchBillingTotalsData = getModifiedBranchLevelData(
        //   branchData,
        //   'billing_totals',
        //   branchData.name
        // );

        return (
          !eachDevice.is_load &&
          <SidebarDevice
            originalDeviceName={originalDeviceName}
            modifiedDeviceName={modifiedDeviceName}
            deviceData={eachDevice}
            setCheckedDevicesId={setCheckedDevicesId}
            checkedDevicesId={checkedDevicesId}
            branchId={branchData.branch_id}
            // deviceDailyKwh={deviceDailyKwh}
            // deviceMonthlyUsage={deviceMonthlyUsage}
            // deviceTimeOfUseTableData={modifiedBranchTimeOfUseTableData}
            // deviceCostTrackerDieselQuantityData={
            //   modifiedBranchCostTrackerDieselQuantityData
            // }
            // deviceCostTrackerMonthlyCostData={
            //   modifiedBranchCostTrackerMonthlyCostData
            // }
            // deviceCostTrackerConsumptionData={
            //   modifiedBranchCostTrackerConsumptionData
            // }
            // deviceBillingTotalsData={{
            //   ...modifiedBranchBillingTotalsData,
            //   present_total: { usage_kwh: 0, value_naira: 0 },
            //   previous_total: { usage_kwh: 0, value_naira: 0 },
            //   usage: {
            //     previous_kwh: 0,
            //     present_kwh: 0,
            //     total_usage_kwh: 0,
            //   },
            //   metrics: {
            //     ipp_per_kwh: 0,
            //     diesel_per_kwh: 0,
            //     utility_per_kwh: 0,
            //     blended_cost_per_kwh: 0,
            //     unit: '₦',
            //   },
            // }}
            key={eachDevice.id}
          />
        );
      })
      : '';

  // const refinedBranchData = getRefinedBranchData(branchData);

  const handleCheck = (event) => {
    setIsChecked(!isChecked);

    if (!isChecked) {
      // Add this branch to list of rendered objects when checked
      // setRenderedDataObjects({
      // ...renderedDataObjects,
      // ...refinedBranchData,
      // });

      // Add this branch to list of checked items
      const newCheckedItems = {
        ...checkedItems,
        [branchData.name]: true,
      }
      setCheckedItems(
        newCheckedItems
      );
      dispatch(setSelectedSideBar(newCheckedItems));

      // Add this branch to list of checked branches
      setCheckedBranches({
        ...checkedBranches,
        [branchData.name]: true,
      });
      setCheckedBranchId(
        branchData.branch_id);
    } else {
      // Delete this branch to list of rendered objects (and checked items) when unchecked
      // const modifiedRenderedDataObjects = cloneObject(renderedDataObjects);
      // delete modifiedRenderedDataObjects[branchData.name];
      // setRenderedDataObjects({
      //   ...modifiedRenderedDataObjects,
      // });

      
      const modifiedCheckedItems = cloneObject(checkedItems);
      delete modifiedCheckedItems[branchData.name];
      setCheckedItems({
        ...modifiedCheckedItems,
      });

      dispatch(setSelectedSideBar(modifiedCheckedItems));

      const modifiedCheckedBranches = cloneObject(checkedBranches);
      delete modifiedCheckedBranches[branchData.name];
      setCheckedBranches({
        ...modifiedCheckedBranches,
      });
    }
  };

  return (
    <li className="sidebar-branch">
      <div className="sidebar-branch__details">
        <div>
          <Checkbox
            className="sidebar-branch__checkbox sidebar-checkbox"
            name={checkBoxName}
            onChange={handleCheck}
            disabled={isAnyDeviceChecked}
          >
            {branchData.name}
          </Checkbox>
        </div>
        {branchData.devices ? (
          <button
            type="button"
            className="sidebar-branch__button"
            onClick={handleToggle}
          >
            {Icon}
          </button>
        ) : (
          ''
        )}
      </div>

      <ul className="sidebar-branch__devices">{deviceComponents}</ul>
    </li>
  );
}

const mapStateToProps = (state) => ({
  sideBar: state.sideBar
});

export default connect(mapStateToProps, null)(SidebarBranch);
