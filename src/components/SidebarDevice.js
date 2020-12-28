import React, { useContext, useState } from 'react';
import { Checkbox } from 'antd';

import CompleteDataContext from '../Context';

import {
  toCamelCase,
  cloneObject,
  convertDateStringToObject,
  convertParameterDateStringsToObjects,
} from '../helpers/genericHelpers';

function SidebarDevice({
  modifiedDeviceName,
  originalDeviceName,
  deviceData,
  deviceDailyKwh,
  deviceMonthlyUsage,
}) {
  const [isChecked, setIsChecked] = useState(false);

  const {
    renderedDataObjects,
    setRenderedDataObjects,
    checkedItems,
    setCheckedItems,
  } = useContext(CompleteDataContext);

  const checkBoxName = toCamelCase(modifiedDeviceName);

  /* -------------------------------------------------------------------
  /* Dashboard Begins --------------------------------------------------
  --------------------------------------------------------------------*/
  // Destructure dashboard data for device
  const {
    total_kwh,
    min_demand,
    max_demand,
    avg_demand,
    dashboard_carbon_emissions,
    cost_of_energy,
    today,
    yesterday,
  } = deviceData.dashboard;
  /* -------------------------------------------------------------------
  /* Dashboard Ends ----------------------------------------------------
  --------------------------------------------------------------------*/

  /* -------------------------------------------------------------------
  /* Score Card Begins -------------------------------------------------
  --------------------------------------------------------------------*/
  // Destructure score card data for device
  const {
    is_generator,
    baseline_energy,
    peak_to_avg_power_ratio,
    score_card_carbon_emissions,
    generator_size_efficiency,
    change_over_lags,
    operating_time,
    fuel_consumption,
  } = deviceData.score_card;

  // Add name to generator size efficiency & fuel consumption data
  if (generator_size_efficiency)
    generator_size_efficiency.name = modifiedDeviceName;
  if (fuel_consumption) fuel_consumption.name = modifiedDeviceName;
  /* -------------------------------------------------------------------
  /* Score Card Ends ---------------------------------------------------
  --------------------------------------------------------------------*/

  /* -------------------------------------------------------------------
  /* Power Quality Begins ----------------------------------------------
  --------------------------------------------------------------------*/
  const powerQualityData = convertParameterDateStringsToObjects(
    deviceData,
    'power_quality'
  );
  // Add device name to data
  powerQualityData.deviceName = modifiedDeviceName;
  /* -------------------------------------------------------------------
  /* Power Quality Ends ------------------------------------------------
  --------------------------------------------------------------------*/

  /* -------------------------------------------------------------------
  /* Last Reading Begins -----------------------------------------------
  --------------------------------------------------------------------*/
  const lastReadingData = Object.assign({}, deviceData.last_reading);
  lastReadingData.date = convertDateStringToObject(lastReadingData.date);
  lastReadingData.deviceName = modifiedDeviceName;
  /* -------------------------------------------------------------------
  /* Last Reading Ends -------------------------------------------------
  --------------------------------------------------------------------*/

  /* -------------------------------------------------------------------
  /* Power Demand Begins -----------------------------------------------
  --------------------------------------------------------------------*/
  const powerDemandData = convertParameterDateStringsToObjects(
    deviceData,
    'power_demand'
  );
  const { dates: power_demand_dates, power_demand_values } = powerDemandData;
  if (power_demand_values) power_demand_values.source = modifiedDeviceName;
  /* -------------------------------------------------------------------
  /* Power Demand Ends -------------------------------------------------
  --------------------------------------------------------------------*/

  // Place all data for device in new object
  const refinedDeviceData = {
    [modifiedDeviceName]: {
      name: modifiedDeviceName,
      // Dashboard data
      total_kwh,
      min_demand,
      max_demand,
      avg_demand,
      dashboard_carbon_emissions,
      cost_of_energy,
      today,
      yesterday,
      daily_kwh: deviceDailyKwh,
      usage_hours: deviceMonthlyUsage,
      // Score card data
      is_generator,
      baseline_energy,
      peak_to_avg_power_ratio,
      score_card_carbon_emissions,
      generator_size_efficiency: [generator_size_efficiency],
      change_over_lags,
      operating_time,
      fuel_consumption: [fuel_consumption],
      // Power Quality Data
      power_quality: [powerQualityData],
      // Last Reading Data
      last_reading: [lastReadingData],
      // Power Demand Data
      power_demand: [{ dates: power_demand_dates, ...power_demand_values }],
    },
  };

  const handleCheck = (event) => {
    setIsChecked(!isChecked);

    /* isChecked will remain falsy when this bit runs.
    /* This is due to the asynchronous nature of the useState hook.
    /* The initial changed value is accessible outside this function
    */
    if (!isChecked) {
      setRenderedDataObjects({
        ...renderedDataObjects,
        ...refinedDeviceData,
      });

      setCheckedItems({
        ...checkedItems,
        [modifiedDeviceName]: true,
      });
    } else {
      const modifiedRenderedDataObjects = cloneObject(renderedDataObjects);
      delete modifiedRenderedDataObjects[modifiedDeviceName];
      setRenderedDataObjects({
        ...modifiedRenderedDataObjects,
      });

      const modifiedCheckedItems = cloneObject(checkedItems);
      delete modifiedCheckedItems[modifiedDeviceName];
      setCheckedItems({
        ...modifiedCheckedItems,
      });
    }
  };

  return (
    <li className='sidebar-device'>
      <div className='sidebar-device__details'>
        <Checkbox
          className='sidebar-device__checkbox'
          name={checkBoxName}
          onChange={handleCheck}
        >
          {originalDeviceName}
        </Checkbox>
      </div>
    </li>
  );
}

export default SidebarDevice;
