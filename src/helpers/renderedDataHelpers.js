import {
  sumArrayOfArrays,
  sumObjectValuesUp,
  getMinDemandObject,
  getMaxDemandObject,
  getAvgDemandObject,
  sumBaselineEnergies,
  sumPeakToAveragePowerRatios,
  sumScoreCardCarbonEmissions,
  getMinDemandObjectKVA,
  getMaxDemandObjectKVA,
  getAvgDemandObjectKVA,
  combineArrayData,
  sumOperatingTimeEnergyTotal,
} from './genericHelpers';


/* -------------------------------------------------------------------
/* Dashboard Calculations Begin --------------------------------------
--------------------------------------------------------------------*/
const getSelectionDailyKwh = (selectedItemsArray) => {
  let selectionDailyKwh = {};

  // const selectionDailyKwhArray =
  selectedItemsArray.length &&
    selectedItemsArray.forEach((eachSelectedItem) => {
      selectionDailyKwh.dates = eachSelectedItem.daily_kwh.dates;

      selectionDailyKwh[eachSelectedItem.name] =
        eachSelectedItem.daily_kwh[eachSelectedItem.name];
    });

  return selectionDailyKwh;
};

const getSelectionMonthlyUsage = (data) => {
  let SelectionMonthlyUsage = { devices: [], hours: [] };

  // Add data for each branch
  data.forEach((eachSelection) => {
    const branchMonthlyUsage = eachSelection.usage_hours?.hours?.reduce(
      (acc, curr) => acc + curr,
      0
    );
    SelectionMonthlyUsage.devices.push(eachSelection.name);
    SelectionMonthlyUsage.hours.push(branchMonthlyUsage);
  });

  return SelectionMonthlyUsage;
};

const getRefinedEnergyData = (data, powerFactorData = null) => {
  // Ensure data isn't falsy
  const refinedEnergyDataArray = data[0] && data;

  const energyValueNames =
    refinedEnergyDataArray && Object.keys(refinedEnergyDataArray[0]);

  let refinedEnergyData = {};

  energyValueNames &&
    energyValueNames.forEach((eachName) => {
      return (refinedEnergyData[eachName] = sumObjectValuesUp(
        refinedEnergyDataArray,
        eachName
      ));
    });

  refinedEnergyData.min_demand =
    refinedEnergyDataArray && getMinDemandObject(refinedEnergyDataArray);
  refinedEnergyData.max_demand =
    refinedEnergyDataArray && getMaxDemandObject(refinedEnergyDataArray);
  refinedEnergyData.avg_demand =
    refinedEnergyDataArray && getAvgDemandObject(refinedEnergyDataArray);

  refinedEnergyData.min_demand_with_power_factor =
    refinedEnergyDataArray && getMinDemandObjectKVA(refinedEnergyDataArray);
  refinedEnergyData.max_demand_with_power_factor =
    refinedEnergyDataArray && getMaxDemandObjectKVA(refinedEnergyDataArray);
  refinedEnergyData.avg_demand_with_power_factor =
    refinedEnergyDataArray && getAvgDemandObjectKVA(refinedEnergyDataArray);

  return refinedEnergyData;
};
/* -------------------------------------------------------------------
/* Dashboard Calculations End ----------------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Score Card Calculations Begin -------------------------------------
--------------------------------------------------------------------*/
// Baseline Energies
const getSelectionBaselineEnergy = (data) => {
  const baselineEnergiesArray = data.map(
    (eachSelection) => eachSelection.baseline_energy
  );

  return sumBaselineEnergies(baselineEnergiesArray);
};

// Peak to Average Power Ratios
const getSelectionPeakToAveragePowerRatio = (data) => {
  const peakToAveragePowerRatioArray = data.map(
    (eachSelection) => eachSelection.peak_to_avg_power_ratio
  );

  return sumPeakToAveragePowerRatios(peakToAveragePowerRatioArray);
};

// Score Card Carbon Emissions
const getSelectionScoreCardCarbonEmissions = (data) => {
  const scoreCardCarbonEmissionsArray = data.map(
    (eachSelection) => eachSelection.score_card_carbon_emissions
  );

  return sumScoreCardCarbonEmissions(scoreCardCarbonEmissionsArray);
};

// Generator Size Efficiency
const getSelectionGeneratorSizeEfficiencyArray = (data) => {

  const nestedSelectedEfficiencies = data.map((eachSelection) =>
    eachSelection.generator_size_efficiency
      ? {
        name: eachSelection.name,
        ...eachSelection.generator_size_efficiency,
      }
      : false
  );

  const flattenedSelectedEfficiencies = nestedSelectedEfficiencies
    .map((eachSelection) => {
      // Remove falsy values, selection names
      return Object.values(eachSelection).filter(
        (eachItem) => typeof eachItem === 'object'
      );
    })
    // flatten
    .flat();

  const selectedEfficienciesSet = new Set();
  flattenedSelectedEfficiencies.filter((item) => {
    const duplicate = selectedEfficienciesSet.has(item.name);
    selectedEfficienciesSet.add(item.name);
    return !duplicate;
  });

  // Remove duplicates with ES6 Sets


  return flattenedSelectedEfficiencies.filter((item) => {
    const duplicate = selectedEfficienciesSet.has(item.name);
    selectedEfficienciesSet.add(item.name);
    return !duplicate;
  });
};

// Change Over Lags
const getSelectionChangeOverLags = (data) => {
  // Get Units First
  const changeOverLagUnits = data
    .map((eachSelection) => eachSelection.change_over_lags.units)
    .filter(Boolean)[0];

  // Get Data
  const allSelectionsChangeOverLagData = data
    .map((eachSelection) => eachSelection.change_over_lags.data)
    .filter(Boolean)
    .flat();

  // Group data by date
  const groupedSelectionChangeOverLags = allSelectionsChangeOverLagData.reduce(
    function (acc, curr) {
      acc[curr.date] = acc[curr.date] || [];
      acc[curr.date].push(curr);
      return acc;
    },
    Object.create(null)
  );

  const selectionChangeOverLagsData = [];

  // Add up values at each date, without adding up(or concatenating) the dates
  for (const date in groupedSelectionChangeOverLags) {
    const summedChangeOverLag = groupedSelectionChangeOverLags[date].reduce(
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
    selectionChangeOverLagsData.push(summedChangeOverLag);
  }

  return { data: selectionChangeOverLagsData, units: changeOverLagUnits };
};

// Operating Time
const getSelectionOperatingTime = (data) => {
  const selectionOperatingTimeDates = data.filter(
    (eachSelection) => eachSelection.is_generator
  ).map((eachData) => eachData.operating_time.chart.dates);

  const allSelectionOperatingTimeDates = combineArrayData(selectionOperatingTimeDates)

  const allSelectionsOperatingTimeValues = data.filter(
    (eachSelection) => eachSelection.is_generator
  ).map((eachData) => eachData.operating_time.chart.values);

  const selectionOperatingTimeValues = combineArrayData(
    allSelectionsOperatingTimeValues
  );

  // recreate function (exclude 'score-card' nesting)
  const sumOperatingTimeValues = (parentArray, nestedValueName) => {
    return parentArray
      .map(
        (eachSelection) =>
          eachSelection.operating_time[nestedValueName] && (
            eachSelection.operating_time[nestedValueName].value || eachSelection.operating_time[nestedValueName].total)
      )
      .filter(Boolean)
      .reduce((acc, curr) => acc + curr, 0);
  };

  const selectionEstimatedTimeWasted = sumOperatingTimeValues(
    data,
    'estimated_time_wasted'
  );
  const selectionEstimatedEnergyWasted = sumOperatingTimeValues(
    data,
    'estimated_energy_wasted'
  );
  const selectionEstimatedDieselWasted = sumOperatingTimeValues(
    data,
    'estimated_diesel_wasted'
  );
  const selectionEstimatedDieselCost = sumOperatingTimeValues(
    data,
    'estimated_cost'
  );

  return {
    chart: {
      dates: allSelectionOperatingTimeDates,
      values: selectionOperatingTimeValues,
    },
    estimated_time_wasted: {
      unit: 'hours',
      value: selectionEstimatedTimeWasted,
    },
    estimated_energy_wasted: {
      unit: 'kWh',
      total: selectionEstimatedEnergyWasted,
    },
    estimated_diesel_wasted: {
      unit: 'litres',
      value: selectionEstimatedDieselWasted,
    },
    estimated_cost: {
      unit: 'naira',
      value: selectionEstimatedDieselCost,
    },
  };
};

// Fuel Consumption
const getSelectionFuelConsumptionArray = (data) => {
  const nestedFuelConsumptions = data.map((eachSelection) => {
    return eachSelection?.fuel_consumption
      ? eachSelection?.fuel_consumption
      : false;
  });

  const flattenedFuelConsumptions = nestedFuelConsumptions
    .map((eachSelection) => {
      // Remove falsy values, selection names
      return Object.values(eachSelection).filter(
        (eachItem) => typeof eachItem === 'object'
      );
    })
    // flatten
    .flat();

  // Remove duplicates with ES6 Sets
  const selectedFuelConsumptionsSet = new Set();

  return flattenedFuelConsumptions.filter((item) => {
    const duplicate = selectedFuelConsumptionsSet.has(item.name);
    selectedFuelConsumptionsSet.add(item.name);
    return !duplicate;
  });
};

/* -------------------------------------------------------------------
/* Score Card Calculations Begin -------------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Parameters Calculations Start -------------------------------------
--------------------------------------------------------------------*/
// Combines property arrays for each selection and removes duplicates
const getSelectionParameterPropertyArray = (data, propertyName) => {
  const nestedProperties = data.map((eachSelection) => {
    return eachSelection[propertyName] ? eachSelection[propertyName] : false;
  });

  const flattenedProperties = nestedProperties
    .map((eachSelection) => {
      // Remove falsy values, selection names
      return Object.values(eachSelection).filter(
        (eachItem) => typeof eachItem === 'object'
      );
    })
    // flatten
    .flat();

  // Remove duplicates with ES6 Sets
  const selectedPropertiesSet = new Set();

  return flattenedProperties.filter((item) => {
    const filterProperty = item.deviceName || item.source || item.branchName;
    const duplicate = selectedPropertiesSet.has(filterProperty);
    selectedPropertiesSet.add(filterProperty);
    return !duplicate;
  });
};
/* -------------------------------------------------------------------
/* Parameters Calculations End ---------------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Energy Consumption Calculations Begin -----------------------------
--------------------------------------------------------------------*/
const sumSelectionEnergyConsumptionValues = (data, valueName) => {
  const allDevicesValues = data.map((eachDevice) => eachDevice[valueName]);

  return allDevicesValues.reduce((acc, curr) => acc + curr, 0);
};
/* -------------------------------------------------------------------
/* Energy Consumption Calculations End -------------------------------
--------------------------------------------------------------------*/

/* -------------------------------------------------------------------
/* Billing Calculations Begin ----------------------------------------
--------------------------------------------------------------------*/
const getSelectionBillingConsumptionNairaValues = (data) => {

  const selectionConsumptionNairaDates =
    data[0]?.billing_consumption_naira?.dates;

  if (!selectionConsumptionNairaDates) {
    return {
      date: null,
      values: null
    }
  }
  const allSelectionsConsumptionNairaValues = data.map(
    (eachSelection) => eachSelection?.billing_consumption_naira?.values
  );

  const selectionConsumptionNairaValues = sumArrayOfArrays(
    allSelectionsConsumptionNairaValues
  );

  return {
    dates: selectionConsumptionNairaDates,
    values: selectionConsumptionNairaValues,
  };
};

const getSelectionBillingTotals = (data) => {
  const allSelectionsBillingTotals = data.map(
    (eachSelection) => eachSelection?.overall_billing_totals
  );

  const extractSingleSelectionValueType = (
    combinedSelectionValues,
    extractedValueName
  ) =>
    combinedSelectionValues.map(
      (eachSelection) => eachSelection[extractedValueName]
    );

  // Present Values
  const allSelectionsPresentTotalValues = extractSingleSelectionValueType(
    allSelectionsBillingTotals,
    'present_total'
  );

  const selectionPresentTotalKwh = extractSingleSelectionValueType(
    allSelectionsPresentTotalValues,
    'usage_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  const selectionPresentTotalNairaValue = extractSingleSelectionValueType(
    allSelectionsPresentTotalValues,
    'value_naira'
  ).reduce((acc, curr) => acc + curr, 0);

  // Previous Values
  const allSelectionsPreviousTotalValues = extractSingleSelectionValueType(
    allSelectionsBillingTotals,
    'previous_total'
  );

  const selectionPreviousTotalKwh = extractSingleSelectionValueType(
    allSelectionsPreviousTotalValues,
    'usage_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  const selectionPreviousTotalNairaValue = extractSingleSelectionValueType(
    allSelectionsPreviousTotalValues,
    'value_naira'
  ).reduce((acc, curr) => acc + curr, 0);

  // Usage Values
  const allSelectionsUsageValues = extractSingleSelectionValueType(
    allSelectionsBillingTotals,
    'usage'
  );

  const selectionUsagePresentKwhValue = extractSingleSelectionValueType(
    allSelectionsUsageValues,
    'present_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  const selectionUsagePreviousKwhValue = extractSingleSelectionValueType(
    allSelectionsUsageValues,
    'previous_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  const selectionUsageTotalKwhValue = extractSingleSelectionValueType(
    allSelectionsUsageValues,
    'total_usage_kwh'
  ).reduce((acc, curr) => acc + curr, 0);

  // Metrics Values
  const allSelectionsMetricsValues = extractSingleSelectionValueType(
    allSelectionsBillingTotals,
    'metrics'
  );
  // Calculate averages of each set of metrics values
  const allSelectionsMetricsDieselPerKwh = extractSingleSelectionValueType(
    allSelectionsMetricsValues,
    'diesel_per_kwh'
  ).filter((val) => val !== 0);
  const avgSelectionMetricsDieselPerKwh =
    allSelectionsMetricsDieselPerKwh.reduce((acc, curr) => acc + curr, 0) /
    allSelectionsMetricsDieselPerKwh.length;

  const allSelectionsMetricsIppPerKwh = extractSingleSelectionValueType(
    allSelectionsMetricsValues,
    'ipp_per_kwh'
  ).filter((val) => val !== 0);
  const avgSelectionMetricsIppPerKwh =
    allSelectionsMetricsIppPerKwh.reduce((acc, curr) => acc + curr, 0) /
    allSelectionsMetricsIppPerKwh.length;

  const allSelectionsMetricsUtilityPerKwh = extractSingleSelectionValueType(
    allSelectionsMetricsValues,
    'utility_per_kwh'
  ).filter((val) => val !== 0);
  const avgSelectionMetricsUtilityPerKwh =
    allSelectionsMetricsUtilityPerKwh.reduce((acc, curr) => acc + curr, 0) /
    allSelectionsMetricsUtilityPerKwh.length;

  const allSelectionsMetricsBlendedCostPerKwh = extractSingleSelectionValueType(
    allSelectionsMetricsValues,
    'blended_cost_per_kwh'
  ).filter((val) => val !== 0);
  const avgSelectionMetricsBlendedCostPerKwh =
    allSelectionsMetricsBlendedCostPerKwh.reduce((acc, curr) => acc + curr, 0) /
    allSelectionsMetricsBlendedCostPerKwh.length;

  return {
    present_total: {
      usage_kwh: selectionPresentTotalKwh,
      value_naira: selectionPresentTotalNairaValue,
    },
    previous_total: {
      usage_kwh: selectionPreviousTotalKwh,
      value_naira: selectionPreviousTotalNairaValue,
    },
    metrics: {
      ipp_per_kwh: avgSelectionMetricsIppPerKwh,
      diesel_per_kwh: avgSelectionMetricsDieselPerKwh,
      utility_per_kwh: avgSelectionMetricsUtilityPerKwh,
      blended_cost_per_kwh: avgSelectionMetricsBlendedCostPerKwh,
      unit: '₦',
    },
    usage: {
      previous_kwh: selectionUsagePreviousKwhValue,
      present_kwh: selectionUsagePresentKwhValue,
      total_usage_kwh: selectionUsageTotalKwhValue,
    },
  };
};
/* -------------------------------------------------------------------
/* Billing Calculations End ------------------------------------------
--------------------------------------------------------------------*/

const getRenderedData = (data, otherStuff = false, showScoreCard=false) => {

  return {
    // Dashboard Stuff
    ...getRefinedEnergyData(data),
    daily_kwh: getSelectionDailyKwh(data),
    usage_hours: getSelectionMonthlyUsage(data),

    ...(!otherStuff && {
      // Power Quality Stuff
      power_quality: getSelectionParameterPropertyArray(data, 'power_quality'),
      // Time of Use Stuff
      last_reading: getSelectionParameterPropertyArray(data, 'last_reading'),
      // Power Demand Stuff
      power_demand: getSelectionParameterPropertyArray(data, 'power_demand'),
      // Time of Use Stuff
      time_of_use_chart: getSelectionParameterPropertyArray(
        data,
        'time_of_use_chart'
      ),
      time_of_use_table: getSelectionParameterPropertyArray(
        data,
        'time_of_use_table'
      ),
      // Energy Consumption Stuff
      energy_consumption_values: getSelectionParameterPropertyArray(
        data,
        'energy_consumption_values'
      ),
      energy_consumption_previous: sumSelectionEnergyConsumptionValues(
        data,
        'energy_consumption_previous'
      ),
      energy_consumption_current: sumSelectionEnergyConsumptionValues(
        data,
        'energy_consumption_current'
      ),
      energy_consumption_usage: sumSelectionEnergyConsumptionValues(
        data,
        'energy_consumption_usage'
      ),
      // Cost Tracker Stuff
      cost_tracker_diesel_qty: getSelectionParameterPropertyArray(
        data,
        'cost_tracker_diesel_qty'
      ),
      cost_tracker_monthly_cost: getSelectionParameterPropertyArray(
        data,
        'cost_tracker_monthly_cost'
      ),
      cost_tracker_consumption: getSelectionParameterPropertyArray(
        data,
        'cost_tracker_consumption'
      ),
      // Billing Stuff
      billing_consumption_kwh: getSelectionParameterPropertyArray(
        data,
        'billing_consumption_kwh'
      ),
      billing_consumption_naira: getSelectionBillingConsumptionNairaValues(data),
      overall_billing_totals: getSelectionBillingTotals(data),
      devices_previous_billing_total: getSelectionParameterPropertyArray(
        data,
        'devices_previous_billing_total'
      ),
      devices_present_billing_total: getSelectionParameterPropertyArray(
        data,
        'devices_present_billing_total'
      ),
    }),

    ...(showScoreCard && {
      // Score Card Stuff

      baseline_energy: getSelectionBaselineEnergy(data),
      peak_to_avg_power_ratio: getSelectionPeakToAveragePowerRatio(data),
      score_card_carbon_emissions: getSelectionScoreCardCarbonEmissions(data),
      generator_size_efficiency: getSelectionGeneratorSizeEfficiencyArray(data),


      // change_over_lags: getSelectionChangeOverLags(data),
      operating_time: getSelectionOperatingTime(data),
      fuel_consumption: getSelectionFuelConsumptionArray(data),
    }),

  };
};
const getBillingRenderedData = (data, isDatshboard = false) => {

  return {
    // Dashboard Stuff

    ...(!isDatshboard && {

      // Billing Stuff
      billing_consumption_kwh: getSelectionParameterPropertyArray(
        data,
        'billing_consumption_kwh'
      ),
      billing_consumption_naira: getSelectionBillingConsumptionNairaValues(data),
      // overall_billing_totals: getSelectionBillingTotals(data),
      devices_previous_billing_total: getSelectionParameterPropertyArray(
        data,
        'devices_previous_billing_total'
      ),
      devices_present_billing_total: getSelectionParameterPropertyArray(
        data,
        'devices_present_billing_total'
      ),
    }),
  };
};

export { getRenderedData, getBillingRenderedData };
