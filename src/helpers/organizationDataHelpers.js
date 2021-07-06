import { getRefinedBranchData } from './branchDataHelpers';
import { getDeviceData } from './deviceDataHelper';

import {
  sumArrayOfArrays,
  getAllOrganizationDevices,
  getModifiedBranchLevelData,
  sumObjectValuesUp,
  sumNestedObjectValuesUp,
  getMinDemandObject,
  getMaxDemandObject,
  getAvgDemandObject,
  getNestedMinDemandObject,
  getNestedMaxDemandObject,
  getNestedAvgDemandObject,
  sumBaselineEnergies,
  sumPeakToAveragePowerRatios,
  sumScoreCardCarbonEmissions,
  sumOperatingTimeValues,
  convertDateStringToObject,
  convertParameterDateStringsToObjects,
} from './genericHelpers';


/* -------------------------------------------------------------------
/* Org Dashboard Calculations Begin ----------------------------------
--------------------------------------------------------------------*/

/*----------------
   Obtain dashboard daily data for organization
  ----------------*/
const getOrganizationDailyKwh = (data) => {
  let organizationDailyKwh = {};

  // Add data for each branch
  data.branches &&
    data.branches.forEach((eachBranch) => {
      const { dates, ...rest } = eachBranch.daily_kwh;
      const allDevicesDailyKwh = Object.values(rest);
      const branchDailyKwh = sumArrayOfArrays(allDevicesDailyKwh);
      organizationDailyKwh.dates = dates;
      organizationDailyKwh[eachBranch.name] = branchDailyKwh;
    });

  // Add total
  const { dates, ...rest } = organizationDailyKwh;
  const allBranchesDailyKwh = Object.values(rest);
  const totalOrganizationDailyKwh = sumArrayOfArrays(allBranchesDailyKwh);
  organizationDailyKwh[data.name] = totalOrganizationDailyKwh;

  return organizationDailyKwh;
};

/*----------------
   Obtain dashboard monthly usage data for organization
  ----------------*/

// const getOrganizationMonthlyUsage = (data) => {
//   let organizationMonthlyUsage = { devices: [], hours: [] };

//   // Add data for each branch
//   data.branches &&
//     data.branches.forEach((eachBranch) => {
//       const branchMonthlyUsage = eachBranch.usage_hours.hours.reduce(
//         (acc, curr) => acc + curr,
//         0
//       );
//       organizationMonthlyUsage.devices.push(eachBranch.name);
//       organizationMonthlyUsage.hours.push(branchMonthlyUsage);
//     });

//   return organizationMonthlyUsage;
// };

/*----------------
   Collate dashboard energy data for each branch
  ----------------*/
const getBranchEnergyDataArray = (data) => {
  return (
    data.branches &&
    data.branches.map((eachBranch) => {
      const energySumValueNames = Object.keys(
        eachBranch.devices[0].dashboard
      ).filter(
        (eachName) =>
          !['name', 'id', 'avg_demand', 'min_demand', 'max_demand'].includes(
            eachName
          )
      );

      let branchEnergyData = {};

      energySumValueNames.forEach((eachName) => {
        return (branchEnergyData[eachName] = sumNestedObjectValuesUp(
          eachBranch.devices,
          'dashboard',
          eachName
        ));
      });
      branchEnergyData.min_demand = getNestedMinDemandObject(
        eachBranch.devices,
        'dashboard'
      );
      branchEnergyData.max_demand = getNestedMaxDemandObject(
        eachBranch.devices,
        'dashboard'
      );
      branchEnergyData.avg_demand = getNestedAvgDemandObject(
        eachBranch.devices,
        'dashboard'
      );

      return branchEnergyData;
    })
  );
};

/*----------------
   Obtain dashboard energy data for organization
  ----------------*/
const getOrganizationEnergyData = (data) => {
  const eachBranchEnergyDataArray = getBranchEnergyDataArray(data);

  const energyValueNames =
    eachBranchEnergyDataArray && Object.keys(eachBranchEnergyDataArray[0]);

  let organizationEnergyData = {};

  energyValueNames &&
    energyValueNames.forEach((eachName) => {
      return (organizationEnergyData[eachName] = sumObjectValuesUp(
        eachBranchEnergyDataArray,
        eachName
      ));
    });

  organizationEnergyData.min_demand = getMinDemandObject(
    eachBranchEnergyDataArray
  );
  organizationEnergyData.max_demand = getMaxDemandObject(
    eachBranchEnergyDataArray
  );
  organizationEnergyData.avg_demand = getAvgDemandObject(
    eachBranchEnergyDataArray
  );

  return organizationEnergyData;
};
/*----------------
   Obtain dashboard energy data for organization ends
  ----------------*/
/* -------------------------------------------------------------------
/* Org Dashboard Calculations End ------------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Org Score Card Calculations Begin ---------------------------------
--------------------------------------------------------------------*/
// Baseline Energies

const getOrganizationBaselineEnergy = (data) => {  
  const allOrganizationDevices = getAllOrganizationDevices(data);
  //console.log(allOrganizationDevices);
  const baselineEnergiesArray = allOrganizationDevices.map(
    (eachDevice) => eachDevice.score_card.baseline_energy
  );
  return sumBaselineEnergies(baselineEnergiesArray);
};

//check if device is a generator or not
const getOrganizationDeviceType = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);
  
  const deviceTypeArray = allOrganizationDevices.map(
    (eachDevice) => 
      eachDevice.score_card ?
    {
      device_name : eachDevice.name,
      is_gen : eachDevice.score_card.is_generator,
    } : false
  );
  return deviceTypeArray;
}

// Peak to Average Power Ratios
const getOrganizationPeakToAveragePowerRatio = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  const peakToAveragePowerRatioArray = allOrganizationDevices.map(
    (eachDevice) => eachDevice.score_card.peak_to_avg_power_ratio
  );
  return sumPeakToAveragePowerRatios(peakToAveragePowerRatioArray);
};

// Score Card Carbon Emissions
const getOrganizationScoreCardCarbonEmissions = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  const scoreCardCarbonEmissionsArray = allOrganizationDevices.map(
    (eachDevice) => eachDevice.score_card.score_card_carbon_emissions
  );

  return sumScoreCardCarbonEmissions(scoreCardCarbonEmissionsArray);
};

// Generator Size Efficiency
const getOrgGeneratorSizeEfficiencyArray = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) =>
    eachDevice.score_card.generator_size_efficiency
      ? {
          name: eachDevice.name,
          ...eachDevice.score_card.generator_size_efficiency,
        }
      : false
  );
};

// Change Over Lags
const getOrganizationChangeOverLags = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  // Get Units First
  const changeOverLagUnits = allOrganizationDevices
    .map((eachDevice) => eachDevice.score_card.change_over_lags.units)
    .filter(Boolean)[0];

  // Get Data
  const allDevicesChangeOverLagData = allOrganizationDevices
    .map((eachDevice) => eachDevice.score_card.change_over_lags.data)
    .filter(Boolean)
    .flat();

  // Group data by date
  const groupedOrganizationChangeOverLags = allDevicesChangeOverLagData.reduce(
    function (acc, curr) {
      acc[curr.date] = acc[curr.date] || [];
      acc[curr.date].push(curr);
      return acc;
    },
    Object.create(null)
  );

  const organizationChangeOverLagsData = [];

  // Add up values at each date, without adding up(or concatenating) the dates
  for (const date in groupedOrganizationChangeOverLags) {
    const summedChangeOverLag = groupedOrganizationChangeOverLags[date].reduce(
      (acc, curr) => {
        for (const prop in curr) {
          if (acc.hasOwnProperty(prop) && prop !== 'date' && prop !== 'id')
            acc[prop] += curr[prop];
          else acc[prop] = curr[prop];
        }
        return acc;
      },
      {}
    );

    // Push summed values to change over lags array
    organizationChangeOverLagsData.push(summedChangeOverLag);
  }

  return { data: organizationChangeOverLagsData, units: changeOverLagUnits };
};

// Operating Time
const getOrganizationOperatingTime = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  const organizationOperatingTimeDates = allOrganizationDevices.map(
    (eachDevice) => eachDevice.score_card.operating_time.chart.dates
  )[0];

  const allDevicesOperatingTimeValues = allOrganizationDevices.map(
    (eachDevice) => eachDevice.score_card.operating_time.chart.values
  );
  const organizationOperatingTimeValues = sumArrayOfArrays(
    allDevicesOperatingTimeValues
  );

  const organizationEstimatedTimeWasted = sumOperatingTimeValues(
    allOrganizationDevices,
    'estimated_time_wasted'
  );
  const organizationEstimatedDieselWasted = sumOperatingTimeValues(
    allOrganizationDevices,
    'estimated_diesel_wasted'
  );
  const organizationEstimatedDieselCost = sumOperatingTimeValues(
    allOrganizationDevices,
    'estimated_cost'
  );

  return {
    chart: {
      dates: organizationOperatingTimeDates,
      values: organizationOperatingTimeValues,
    },
    estimated_time_wasted: {
      unit: 'hours',
      value: organizationEstimatedTimeWasted,
    },
    estimated_diesel_wasted: {
      unit: 'litres',
      value: organizationEstimatedDieselWasted,
    },
    estimated_cost: {
      unit: 'naira',
      value: organizationEstimatedDieselCost,
    },
  };
};

// Fuel Consumption
const getOrganizationFuelConsumptionArray = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) => {
    if (eachDevice.score_card.fuel_consumption)
      eachDevice.score_card.fuel_consumption.name = eachDevice.name;

    return eachDevice.score_card.fuel_consumption
      ? eachDevice.score_card.fuel_consumption
      : false;
  });
};
/* -------------------------------------------------------------------
/* Org Score Card Calculations End -----------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Org Power Quality Calculations Start ------------------------------
--------------------------------------------------------------------*/
const getOrganizationPowerQualityData = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) => {
    const devicePowerQualityData = convertParameterDateStringsToObjects(
      eachDevice,
      'power_quality'
    );
    // Add device name to data
    devicePowerQualityData.deviceName = eachDevice.name;

    return devicePowerQualityData;
  });
};
/* -------------------------------------------------------------------
/* Org Power Quality Calculations End --------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Org Last Reading Calculations Start ------------------------------
--------------------------------------------------------------------*/
const getOrganizationLastReadingData = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) => {
    const deviceLastReadingData = Object.assign({}, eachDevice.last_reading);
    deviceLastReadingData.date = convertDateStringToObject(
      deviceLastReadingData.date
    );
    deviceLastReadingData.deviceName = eachDevice.name;

    return deviceLastReadingData;
  });
};
/* -------------------------------------------------------------------
/* Org Last Reading Calculations End --------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Org Power Demand Calculations Start -------------------------------
--------------------------------------------------------------------*/
const getOrganizationPowerDemandData = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) => {
    const devicePowerDemandData = convertParameterDateStringsToObjects(
      eachDevice,
      'power_demand'
    );

    const { dates, power_demand_values } = devicePowerDemandData;
    if (power_demand_values) power_demand_values.source = eachDevice.name;

    return { dates, ...power_demand_values };
  });
};
/* -------------------------------------------------------------------
/* Org Power Demand Calculations End ---------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Org Time of Use Calculations Start --------------------------------
--------------------------------------------------------------------*/
const getOrganizationTimeOfUseChartData = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) => {
    const deviceTimeOfUseChartData = convertParameterDateStringsToObjects(
      eachDevice,
      'time_of_use'
    );

    if (deviceTimeOfUseChartData)
      deviceTimeOfUseChartData.deviceName = eachDevice.name;

    return deviceTimeOfUseChartData;
  });
};

const getOrganizationTimeOfUseTableData = (data) =>
  data &&
  data.branches.map((eachBranch) =>
    getModifiedBranchLevelData(eachBranch, 'time_of_use_table', eachBranch.name)
  );
/* -------------------------------------------------------------------
/* Org Time of Use Calculations End ----------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Energy Consumption Calculations Start -----------------------------
--------------------------------------------------------------------*/
const getOrganizationEnergyConsumptionValues = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) => {
    const deviceEnergyConsumptionData = convertParameterDateStringsToObjects(
      eachDevice,
      'energy_consumption'
    );

    const { dates, energy_consumption_values } = deviceEnergyConsumptionData;
    if (energy_consumption_values)
      energy_consumption_values.deviceName = eachDevice.name;

    return { dates, ...energy_consumption_values };
  });
};

const sumOrganizationEnergyConsumptionValues = (data, valueName) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  const allDevicesValues = allOrganizationDevices.map(
    (eachDevice) => eachDevice.energy_consumption[valueName]
  );

  return allDevicesValues.reduce((acc, curr) => acc + curr, 0);
};
/* -------------------------------------------------------------------
/* Energy Consumption Calculations End -------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Org Cost Tracker Calculations Start -----------------------------
--------------------------------------------------------------------*/
const getOrganizationCostTrackerDieselQuantityData = (data) =>
  data &&
  data.branches.map((eachBranch) =>
    getModifiedBranchLevelData(
      eachBranch,
      'cost_tracker_qty_of_diesel',
      eachBranch.name
    )
  );

const getOrganizationCostTrackerMonthlyCostData = (data) =>
  data &&
  data.branches.map((eachBranch) =>
    getModifiedBranchLevelData(
      eachBranch,
      'cost_tracker_monthly_cost',
      eachBranch.name
    )
  );

const getOrganizationCostTrackerConsumptionData = (data) =>
  data &&
  data.branches.map((eachBranch) =>
    getModifiedBranchLevelData(
      eachBranch,
      'cost_tracker_consumption_breakdown',
      eachBranch.name
    )
  );
/* -------------------------------------------------------------------
/* Org Cost Tracker Calculations End ---------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Org Billing Calculations Start ------------------------------------
--------------------------------------------------------------------*/
const getOrganizationBillingConsumptionKwhValues = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) => {
    const { billing } = eachDevice;

    const deviceConsumptionKwhWithoutName = convertParameterDateStringsToObjects(
      billing,
      'consumption_kwh'
    );

    return {
      ...deviceConsumptionKwhWithoutName,
      deviceName: eachDevice.name,
    };
  });
};

const getOrganizationBillingConsumptionNairaValues = (data) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  const allDevicesConsumptionNairaObjects = allOrganizationDevices.map(
    (eachDevice) => {
      const { billing } = eachDevice;
      const deviceConsumptionNairaWithDateObjects = convertParameterDateStringsToObjects(
        billing,
        'consumption_naira'
      );

      return deviceConsumptionNairaWithDateObjects;
    }
  );

  const organizationConsumptionNairaDates =
    allDevicesConsumptionNairaObjects[0].dates;

  const allDevicesConsumptionNairaValues = allDevicesConsumptionNairaObjects.map(
    (eachDevice) => eachDevice.values
  );
  const organizationConsumptionNairaValues = sumArrayOfArrays(
    allDevicesConsumptionNairaValues
  );

  return {
    dates: organizationConsumptionNairaDates,
    values: organizationConsumptionNairaValues,
  };
};

const getOrganizationBillingTotals = (data) => {
  const allBranchesBillingTotals =
    data &&
    data.branches.map((eachBranch) =>
      getModifiedBranchLevelData(eachBranch, 'billing_totals', eachBranch.name)
    );

  const extractSingleBranchValueType = (
    combinedBranchValues,
    extractedValueName
  ) => combinedBranchValues.map((eachBranch) => eachBranch[extractedValueName]);

  // Present Values
  const allBranchesPresentTotalValues = extractSingleBranchValueType(
    allBranchesBillingTotals,
    'present_total'
  );

  const organizationPresentTotalKwh = extractSingleBranchValueType(
    allBranchesPresentTotalValues,
    'usage_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  const organizationPresentTotalNairaValue = extractSingleBranchValueType(
    allBranchesPresentTotalValues,
    'value_naira'
  ).reduce((acc, curr) => acc + curr, 0);

  // Previous Values
  const allBranchesPreviousTotalValues = extractSingleBranchValueType(
    allBranchesBillingTotals,
    'previous_total'
  );

  const organizationPreviousTotalKwh = extractSingleBranchValueType(
    allBranchesPreviousTotalValues,
    'usage_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  const organizationPreviousTotalNairaValue = extractSingleBranchValueType(
    allBranchesPreviousTotalValues,
    'value_naira'
  ).reduce((acc, curr) => acc + curr, 0);

  // Usage Values
  const allBranchesUsageValues = extractSingleBranchValueType(
    allBranchesBillingTotals,
    'usage'
  );

  const organizationUsagePresentKwhValue = extractSingleBranchValueType(
    allBranchesUsageValues,
    'present_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  const organizationUsagePreviousKwhValue = extractSingleBranchValueType(
    allBranchesUsageValues,
    'previous_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  const organizationUsageTotalKwhValue = extractSingleBranchValueType(
    allBranchesUsageValues,
    'total_usage_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  // Metrics Values
  const allBranchesMetricsValues = extractSingleBranchValueType(
    allBranchesBillingTotals,
    'metrics'
  );
  // Calculate averages of each set of metrics values
  const organizationMetricsDieselPerKwh =
    extractSingleBranchValueType(
      allBranchesMetricsValues,
      'diesel_per_kwh'
    ).reduce((acc, curr) => acc + curr, 0) / allBranchesMetricsValues.length;

    const organizationMetricsIppPerKwh =
    extractSingleBranchValueType(
      allBranchesMetricsValues,
      'ipp_per_kwh'
    ).reduce((acc, curr) => acc + curr, 0) / allBranchesMetricsValues.length;

  const organizationMetricsUtilityPerKwh =
    extractSingleBranchValueType(
      allBranchesMetricsValues,
      'utility_per_kwh'
    ).reduce((acc, curr) => acc + curr, 0) / allBranchesMetricsValues.length;

  const organizationMetricsBlendedCostPerKwh =
    extractSingleBranchValueType(
      allBranchesMetricsValues,
      'blended_cost_per_kwh'
    ).reduce((acc, curr) => acc + curr, 0) / allBranchesMetricsValues.length;

  return {
    present_total: {
      usage_kwh: organizationPresentTotalKwh,
      value_naira: organizationPresentTotalNairaValue,
    },
    previous_total: {
      usage_kwh: organizationPreviousTotalKwh,
      value_naira: organizationPreviousTotalNairaValue,
    },
    metrics: {
      ipp_per_kwh: organizationMetricsIppPerKwh,
      diesel_per_kwh: organizationMetricsDieselPerKwh,
      utility_per_kwh: organizationMetricsUtilityPerKwh,
      blended_cost_per_kwh: organizationMetricsBlendedCostPerKwh,
      unit: '₦',
    },
    usage: {
      previous_kwh: organizationUsagePreviousKwhValue,
      present_kwh: organizationUsagePresentKwhValue,
      total_usage_kwh: organizationUsageTotalKwhValue,
    },
  };
};

// Obtains previous total or present total for all devices in a organization
const getOrganizationDevicesBillingTotal = (data, totalType) => {
  const allOrganizationDevices = getAllOrganizationDevices(data);

  return allOrganizationDevices.map((eachDevice) => {
    const { billing } = eachDevice;
    const specifiedTotal = billing.totals[totalType];

    return {
      ...specifiedTotal,
      deviceName: eachDevice.name,
    };
  });
};
/* -------------------------------------------------------------------
/* Org Billing Calculations End --------------------------------------
--------------------------------------------------------------------*/

const getRefinedOrganizationData = (data) => {    

  getOrganizationDeviceType(data);
  return {
    all_device_data : {...getAllOrganizationDevices(data)},
    name: data.name,
    // Dashboard Stuff
    ...getOrganizationEnergyData(data),
    daily_kwh: getOrganizationDailyKwh(data),
    // usage_hours: getOrganizationMonthlyUsage(data),
    // Score Card Stuff
    organization_device_type : getOrganizationDeviceType(data),
    baseline_energy: getOrganizationBaselineEnergy(data),
    peak_to_avg_power_ratio: getOrganizationPeakToAveragePowerRatio(data),
    score_card_carbon_emissions: getOrganizationScoreCardCarbonEmissions(data),
    generator_size_efficiency: getOrgGeneratorSizeEfficiencyArray(data),
    change_over_lags: getOrganizationChangeOverLags(data),
    operating_time: getOrganizationOperatingTime(data),
    fuel_consumption: getOrganizationFuelConsumptionArray(data),
    // Power Quality Stuff
    power_quality: getOrganizationPowerQualityData(data),
    // Time of Use Stuff
    last_reading: getOrganizationLastReadingData(data),
    // Power Demand Stuff
    power_demand: getOrganizationPowerDemandData(data),
    // Time of Use Stuff
    time_of_use_chart: getOrganizationTimeOfUseChartData(data),
    time_of_use_table: getOrganizationTimeOfUseTableData(data),
    // Energy Consumption Stuff
    energy_consumption_values: getOrganizationEnergyConsumptionValues(data),
    energy_consumption_previous: sumOrganizationEnergyConsumptionValues(
      data,
      'previous'
    ),
    energy_consumption_current: sumOrganizationEnergyConsumptionValues(
      data,
      'current'
    ),
    energy_consumption_usage: sumOrganizationEnergyConsumptionValues(
      data,
      'usage'
    ),
    // Cost Tracker  Stuff
    cost_tracker_diesel_qty: getOrganizationCostTrackerDieselQuantityData(data),
    cost_tracker_monthly_cost: getOrganizationCostTrackerMonthlyCostData(data),
    cost_tracker_consumption: getOrganizationCostTrackerConsumptionData(data),
    // Billing Stuff
    billing_consumption_kwh: getOrganizationBillingConsumptionKwhValues(data),
    billing_consumption_naira: getOrganizationBillingConsumptionNairaValues(
      data
    ),
    overall_billing_totals: getOrganizationBillingTotals(data),
    devices_previous_billing_total: getOrganizationDevicesBillingTotal(
      data,
      'previous_total'
    ),
    devices_present_billing_total: getOrganizationDevicesBillingTotal(
      data,
      'present_total'
    ),
  };
};

export { getRefinedOrganizationData, getOrganizationFuelConsumptionArray, getOrganizationDeviceType };


/* -------------------------------------------------------------------
/* Handles when a date search is made wit while some checkbox are ticked
--------------------------------------------------------------------*/
// const getRefinedOrganizationDataWithChekBox = ({
//   checkedBranches,
//   checkedDevices,
//   organization,
//   setRenderedDataObjects
// }) => {

//   let branchAndDevice = {}
//   // convert branches to array using the object keys
//   const branches = Object.keys(checkedBranches);
//   // convert device to array using the object keys
//   const devices = Object.keys(checkedDevices);

//   // convert branches or device are present then
//   if (branches.length !== 0 || devices.length > 0) {

//     organization.branches.forEach((branch) => {
//       if (branches.length > 0) {
//         // check whether the branch name is part of the branches array
//         if (branches.includes(branch.name)) {
//           branchAndDevice = { ...branchAndDevice, ...getRefinedBranchData(branch) }
//         }

//       }
//       if (devices.length > 0) {
//         branch.devices.forEach((device) => {
//           const combinedNames = `${branch.name} ${device.name}`;
//            // check whether the device name is part of the devices array
//           if (devices.includes(combinedNames)) {
//             branchAndDevice = { ...branchAndDevice, ...getDeviceData({ branchData: branch, deviceData: device }) }
//           }
//         })

//       }
//     })
//   }
//   setRenderedDataObjects(branchAndDevice);
//   return branchAndDevice;
// }
