import dayjs from 'dayjs';
import { numberFormatter } from './numberFormatter';

/* --------------------------------------------------------------------
/* Completely Generic Helpers ------------------------------------------
--------------------------------------------------------------------*/

function removeDuplicateDatas(value, index, self) {
  return self.indexOf(value) === index;
}


const mergeTheData = (arr) => {
  return [...new Set([].concat(...arr))];
}

const truncateEmail = (str, num) => {
  if (str.length <= num) {
    return str
  }
  return str.slice(0, num) + '...'
}

const toCamelCase = (str) =>
  str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, '');

const toKebabCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');

const toSnakeCase = (str) =>
  str &&
  str
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('_');

const cloneObject = (object) => Object.assign({}, object);

const getLastArrayItems = (array, numberOfItems) => {
  return array && array.slice(Math.max(array.length - numberOfItems, 0));
};

//checkIsGenStatus
const checkIsGenStatus = (data) => {
  const checkStatus = data.filter(Boolean);
  return checkStatus.length
}


const daysInMonth = () => {
  const date = new Date();
  const currentDate = date.getDate();
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  //const numberOfDaysInMonth = new Date(currentYear, currentMonth+1, 0).getDate();
  return new Date(currentYear, currentMonth + 1, 0).getDate();
}

/*
 * Sum up values a the same index in each array found in a wrapper array
 * @param  {Array}   arrayOfArrays  an array which contains other arrays of numbers
 */
const sumArrayOfArrays = (arrayOfArrays) => {

  return arrayOfArrays && arrayOfArrays?.reduce((acc, curr) => {
    curr && curr.forEach((innerArrayItem, index) => {
      acc[index] = (acc[index] || 0) + innerArrayItem;
    });
    return acc;
  }, []);
}
/*
 * Sum up values a the same index in each array found in a wrapper array
 * @param  {Array}   arrayOfArrays  an array which contains other arrays of numbers
 */
const combineArrayData = (arrayOfArrays) => {

  let newArrayData = [];
  arrayOfArrays && arrayOfArrays?.forEach((newArray) => {
    newArrayData = newArrayData.concat(newArray);
  });
  return newArrayData;
}


const calculateRatio = (avg, peak) => {
  let peak_ratio = Number(avg) / Number(peak)

  if (peak_ratio && isFinite(peak_ratio)) {
    return peak_ratio.toFixed(2)
  }
  return 0;
}

const getPeakToAverageMessage = (peakRatio) => {
  let peakMessage;
  let peakMessageColor;
  if (peakRatio > 0.7) {
    peakMessage = 'Efficient';
    peakMessageColor = '#008000';
  } else if (peakRatio >= 0.5) {
    peakMessage = 'Fairly efficient';
    peakMessageColor = '#FFBF00';
  } else {
    peakMessage = 'Inefficient - Higher is better';
    peakMessageColor = '#fa0303';
  }
  return { message: peakMessage, color: peakMessageColor }
}

const getGeneratorSizeMessage = (percent) => {
  const ratio = (percent / 100);
  let message;
  let color;
  if (ratio === 0.01) {
    message = 'Not In Use';
    color = '#fa0303';
  }
  else if (ratio > 0.7) {
    message = 'Overloaded';
    color = '#fa0303';

  } else if (ratio >= 0.51) {
    message = 'Efficient Loading';
    color = '#008000';
  } else if (ratio >= 0.36) {
    message = 'Fairly Efficient Loading';
    color = '#008000';
  } else {
    message = 'Inefficient';
    color = '#FFBF00';

  }
  return { message, color }
}

const getBaselineEnergyColor = (inbound) => {
  let peakMessageColor;
  if (Number(inbound) > 0) {
    peakMessageColor = '#008000';
  } else {
    peakMessageColor = '#fa0303';
  }
  return { color: peakMessageColor }
}

const calculatePercentage = (num_1, num_2) => {
  const percentage = ((num_1 / num_2) * 100).toFixed() || 0;

  if (isNaN(percentage)) {
    return 0;
  }
  return percentage
};

const calculatePercentageTwoDecimal = (num_1, num_2) => {
  const percentage = ((num_1 / num_2) * 100).toFixed(2) || 0;

  if (isNaN(percentage)) {
    return 0;
  }
  return percentage
};
// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// 
/**
 * @description nadd the usage hour to the device
 * @param {*} branch the branch
 * @param {*} deviceName the name of the device
 * @returns the usage hours of the int
 */
const addUsageHoursToDevice = (branch, deviceName) => {
  const index = branch.usage_hours?.devices.findIndex((item) => deviceName === item);
  return branch.usage_hours?.hours[index]
}

const getAllOrganizationDevices = (data) => {
  return (
    data.branches &&
    data.branches
      .map((eachBranch) => {
        // Add branch name to each device name
        eachBranch.devices.forEach((device) => {
          // Prevent process from repeating several times
          if (!device.name.includes(eachBranch.name)) {
            device.usage_hour = addUsageHoursToDevice(eachBranch, device.name, eachBranch.name)
            device.deviceName = device.name;
            device.name = eachBranch.name + ' ' + device.name;
            device.branchName = eachBranch.name;
          }
        });

        return eachBranch.devices;
      })
      .flat()
  );
};



const getModifiedBranchLevelData = (branchData, propertyName, branchName) => {
  const branchLevelDataOfProperty = branchData && branchData[propertyName];

  // Add name to data
  return {
    ...branchLevelDataOfProperty,
    branchName: branchName,
  };
};

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

/* --------------------------------------------------------------------
/* Dashboard Helpers Begin ------------------------------------------
Note: Although the dash helpers are named with generic names, they are
hardly used in any other section
--------------------------------------------------------------------*/
/*
 * Sum up values (for one value type) nested deep within an array of objects.
 * Output shape: {unit: "kwh", value: outputNumber}
 * @param  {Array}   array  an array of objects
 * @param  {String}  the name of the value needed in the output
 */
const sumObjectValuesUp = (array, valueName) => {
  // Pick out values and place them in array(s)
  const valuesArray = array?.map(
    (eachItem) => eachItem[valueName] && eachItem[valueName].value
  );

  const unitsArray = array.map(
    (eachItem) => eachItem[valueName] && eachItem[valueName].unit
  );

  // Sum up values in each array
  const valuesTotal = valuesArray.reduce((acc, curr) => acc + curr, 0);

  return { unit: unitsArray[0], value: valuesTotal };
};

// Same as a above but for an even deeper nested object within an array.
const sumNestedObjectValuesUp = (array, nestedObject, valueName) => {

  // get is source
  const only_isSource = array.filter(
    (eachItem) =>
      eachItem.is_source
  );


  // Pick out values and place them in array(s)
  const valuesArray = only_isSource.map(
    (eachItem) =>
      eachItem[nestedObject][valueName] &&
      eachItem[nestedObject][valueName].value
  );

  const unitsArray = only_isSource?.map(
    (eachItem) =>
      eachItem[nestedObject][valueName] &&
      eachItem[nestedObject][valueName].unit
  );

  // Sum up values in each array
  const valuesTotal = valuesArray.reduce((acc, curr) => acc + curr, 0);

  return { unit: unitsArray[0], value: valuesTotal };
};

const getMinDemandObject = (array) => {

  const valuesArray = array?.map((eachItem) =>  eachItem.min_demand && eachItem.min_demand.value);

  //Obtain min demand of all min demands
  const valuesArrayMin = Math.min.apply(null, valuesArray);

  return { unit: 'kW', value: isFinite(valuesArrayMin) ? valuesArrayMin : 0 };
};
const getMinDemandObjectKVA = (array, powerFactorData) => {
  const valuesArray = array?.map((eachItem) => eachItem.min_demand_with_power_factor.value);

  //Obtain min demand of all min demands
  const valuesArrayMin = Math.min.apply(null, valuesArray);

  return { unit: 'kVA', value: isFinite(valuesArrayMin) ? valuesArrayMin : 0 };
};

const getNestedMinDemandObject = (array, nestedObject) => {
  const valuesArray = array.filter(
    (eachItem) => eachItem[nestedObject]?.min_demand.value > 0
  ).map((eachItem) => eachItem[nestedObject]?.min_demand.value);
  //Obtain min demand of all min demands
  const valuesArrayMin = Math.min.apply(null, valuesArray);

  return { unit: 'kW', value: valuesArrayMin };
};
const getNestedMinDemandObjectKVA = (allDeviceData, nestedObject, powerFactorData = null) => {
  const valuesArray = Object.values(allDeviceData).filter(
    (eachItem) => eachItem[nestedObject]?.min_demand?.value > 0
  ).map((eachItem) => {
    const powerFactor = powerFactorData && powerFactorData.find((factor) => factor.data.device_id === eachItem.device_id);
    return powerFactor && powerFactor.data && powerFactor.data.data.avg_pf ? (eachItem[nestedObject].min_demand?.value / powerFactor.data.data.avg_pf)
      : (eachItem[nestedObject].min_demand?.value / 0.78);
  }
  );

  //Obtain min demand of all min demands
  const valuesArrayMin = Math.min.apply(null, valuesArray);

  return { unit: 'kVA', value: valuesArrayMin };
};

const getMaxDemandObject = (array) => {
  const valuesArray = array.map((eachItem) => eachItem.max_demand && eachItem.max_demand.value);

  //Obtain max demand of all max demands
  const valuesArrayMax = Math.max.apply(null, valuesArray);

  return { unit: 'kW', value: valuesArrayMax };
};
const getMaxDemandObjectKVA = (array, powerFactorData) => {
  const valuesArray = array.map((eachItem) => eachItem.max_demand_with_power_factor.value);

  //Obtain min demand of all min demands
  const valuesArrayMin = Math.max.apply(null, valuesArray);

  return { unit: 'kVA', value: isFinite(valuesArrayMin) ? valuesArrayMin : 0 };
};

const getNestedMaxDemandObject = (array, nestedObject) => {
  const valuesArray = array.map(
    (eachItem) => eachItem[nestedObject]?.max_demand.value
  );

  //Obtain max demand of all max demands
  const valuesArrayMax = Math.max.apply(null, valuesArray);

  return { unit: 'kW', value: valuesArrayMax };
};
const getNestedMaxDemandObjectKva = (allDeviceData, nestedObject, powerFactorData) => {
  const valuesArray = Object.values(allDeviceData).map(
    (eachItem) => {
      const powerFactor = powerFactorData && powerFactorData.find((factor) => factor.data.device_id === eachItem.device_id);
      return powerFactor && powerFactor.data && powerFactor.data.data.avg_pf ? (eachItem[nestedObject]?.max_demand.value / powerFactor.data.data.avg_pf)
        : (eachItem[nestedObject]?.max_demand.value / 0.78);
      // return eachItem[nestedObject].max_demand.value;
    }
  );

  //Obtain max demand of all max demands
  const valuesArrayMax = Math.max.apply(null, valuesArray);

  return { unit: 'kVA', value: valuesArrayMax };
};

const getAvgDemandObject = (array) => {
  const valuesArray = array.map((eachItem) => eachItem.avg_demand && eachItem.avg_demand.value);

  //Obtain avg demand of all avg demands
  const valuesArrayAvg =
    valuesArray.reduce((acc, curr) => acc + curr, 0) / valuesArray.length;

  return { unit: 'kW', value: valuesArrayAvg };
};
const getAvgDemandObjectKVA = (array) => {
  const valuesArray = array.map((eachItem) => eachItem.avg_demand_with_power_factor.value);

  //Obtain min demand of all min demands
  const valuesArrayAvg =
    valuesArray.reduce((acc, curr) => acc + curr, 0) / valuesArray.length;

  return { unit: 'kVA', value: valuesArrayAvg };
};

const getNestedAvgDemandObject = (array, nestedObject) => {
  const valuesArray = array.map(
    (eachItem) => eachItem[nestedObject]?.avg_demand.value
  );

  //Obtain avg demand of all avg demands
  const valuesArrayAvg =
    valuesArray.reduce((acc, curr) => acc + curr, 0) / valuesArray.length;

  return { unit: 'kW', value: valuesArrayAvg };
};
const getNestedAvgDemandObjectKva = (allDeviceData, nestedObject, powerFactorData) => {
  const valuesArray = Object.values(allDeviceData).map(
    (eachItem) => {
      const powerFactor = powerFactorData && powerFactorData.find((factor) => factor.data.device_id === eachItem.device_id);
      return powerFactor && powerFactor.data && powerFactor.data.data.avg_pf ? ((eachItem[nestedObject] ? eachItem[nestedObject].avg_demand.value : 1) / powerFactor.data.data.avg_pf)
        : (eachItem[nestedObject] ? (eachItem[nestedObject].avg_demand.value) : 1 / 0.8);

      // return eachItem[nestedObject].avg_demand.value;
    }

  );

  //Obtain avg demand of all avg demands
  const valuesArrayAvg =
    valuesArray.reduce((acc, curr) => acc + curr, 0) / valuesArray.length;

  return { unit: 'kVA', value: valuesArrayAvg };
};

const allDeviceGenerators = (checkedItems, organization) => {

  let holdAllDevices = [];
  const checkedItemsArray = Object.keys(checkedItems);

  checkedItemsArray.map((name) => {
    organization.branches.forEach((eachBranch) => {
      if (eachBranch.name === name) {
        holdAllDevices = [...holdAllDevices, ...eachBranch.devices];
      }
      else if (name.startsWith(eachBranch.name) && (name.length > eachBranch.name.length)
      ) {
        eachBranch.devices.some((device) => {
          if (name.includes(device.name)) {
            holdAllDevices.push(device);
            return false;
          }
        })
      }
    })
  })
  return holdAllDevices;
}

const allCheckedDeviceGenerators = (checkedItems, allDevice) => {

  let holdAllDevices = [];
  const checkedItemsArray = Object.keys(checkedItems);
  const allDeviceMap = Object.values(allDevice);

  if (!checkedItemsArray.length > 0) {
    return allDeviceMap;
  } else {
    checkedItemsArray.map((name) => {
      allDeviceMap.forEach((eachData) => {
        if (eachData.branchName === name) {
          holdAllDevices = [...holdAllDevices, eachData];
        }
        else if (name.startsWith(eachData.branchName) && name.endsWith(eachData.deviceName)
        ) {
          holdAllDevices.push(eachData);
        }
      })
    })
    return holdAllDevices;
  }
}

// handle cost tracker baseline data flatner base on selected branch/devices
const allCostTrackerBranchesBaseline = (checkedItems, allDevice) => {
  let holdAllDevices = [];
  const checkedItemsArray = Object.keys(checkedItems || {});
  if (!checkedItemsArray.length > 0) {
    allDevice.map(([branchName, branchInfo]) => {
      const baselineDataValues = Object.values(branchInfo.baseline);
      baselineDataValues.map((data) => {
        holdAllDevices = [...holdAllDevices, ...data];
      })
    });
  } else {
    checkedItemsArray.map((name) => {
      allDevice.map(([branchName, branchInfo]) => {
        const baselineDataValues = Object.values(branchInfo.baseline);
        if (branchName === name) {
          baselineDataValues.map((data) => {
            holdAllDevices = [...holdAllDevices, ...data];
          })
        }
        else if (name.startsWith(branchName)
        ) {
          Object.entries(branchInfo.baseline).map(([deviceName, value]) => {

            if (name.endsWith(deviceName)) {
              holdAllDevices.push(...value);
            }
          })
        }
      })
    })
  }
  return holdAllDevices;
}




/* --------------------------------------------------------------------
/* Dashboard Helpers End --------------------------------------------
--------------------------------------------------------------------*/

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

/* --------------------------------------------------------------------
/* Score Card Helpers Begin ------------------------------------------
--------------------------------------------------------------------*/
const sumBaselineEnergies = (array) => {
  const forecastValues = array && array?.map((eachItem) => eachItem?.forecast);
  const usedValues = array && array?.map((eachItem) => eachItem?.used);
  const forecastTotal = forecastValues && forecastValues?.reduce((acc, curr) => acc + curr, 0);
  const usedTotal = usedValues && usedValues?.reduce((acc, curr) => acc + curr, 0);

  return { unit: 'kWh', forecast: forecastTotal, used: usedTotal };
};

const sumPeakToAveragePowerRatios = (array) => {
  const peakValues = array?.map((eachItem) => eachItem?.peak);
  const avgValues = array?.map((eachItem) => eachItem?.avg);

  const peakOfPeakValues = Math.max.apply(null, peakValues);
  const avgOfAvgValues =
    avgValues.reduce((acc, curr) => acc + curr, 0) / avgValues.length;

  return { unit: 'kW', peak: peakOfPeakValues, avg: avgOfAvgValues };
};

const sumScoreCardCarbonEmissions = (array) => {
  const estimatedValues = array.map((eachItem) => eachItem?.estimated_value);
  const actualValues = array.map((eachItem) => eachItem?.actual_value);

  const estimatedTotal = estimatedValues.reduce((acc, curr) => acc + curr, 0);
  const actualTotal = actualValues.reduce((acc, curr) => acc + curr, 0);

  return {
    unit: 'tons',
    estimated_value: estimatedTotal,
    actual_value: actualTotal,
  };
};

const joinChangeOverLagsValues = (parentArray, nestedValue) => {
  return parentArray
    .map(
      (eachDevice) =>
        eachDevice.score_card?.change_over_lags &&
        eachDevice.score_card?.change_over_lags[nestedValue].values
    )
    .filter(Boolean);
};

const sumOperatingTimeValues = (parentArray, nestedValueName) => {
  return parentArray
    .filter(
      (eachDevice) => eachDevice.score_card.is_generator

    ).map((eachFilterDevice) =>
      eachFilterDevice.score_card.operating_time[nestedValueName] && (
        eachFilterDevice.score_card.operating_time[nestedValueName].value || eachFilterDevice.score_card.operating_time[nestedValueName].total))
    .filter(Boolean)
    .reduce((acc, curr) => acc + curr, 0);
};

// round decimple to the legth specifile
const roundToDecimalPLace = (number, length) => (!Number.isInteger(number)
  ? number : Number(number).toFixed(length));

const sumOfArrayElements = (array) => array.reduce((acc, curr) => acc + Number(curr), 0)

/* --------------------------------------------------------------------
/* Score Card Helpers End -------------------------------------------
--------------------------------------------------------------------*/

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

/* --------------------------------------------------------------------
/* Parameters Helpers Start-------------------------------------------
--------------------------------------------------------------------*/
// DayJS chosen for browser compatibility (and consistency) issues with native date objects.
const convertDateStringToObject = (dateString) => {
  return dayjs(dateString);
};

const convertDateStringsToObjects = (dateStrings) => {
  return dateStrings?.map((eachDate) => dayjs(eachDate));
};

const formatParametersDatetimes = (dateStrings) => {
  return dateStrings?.map((eachDate) => eachDate.format('DD/MM/YYYY h:mm A'));
};

const formatParametersDates = (dateStrings) => {
  return dateStrings?.map((eachDate) => eachDate.format('DD/MM/YYYY'));
};

const formatParametersTimes = (dateStrings) => {
  return dateStrings?.map((eachDate) => eachDate.format('hh:mm A'));
};

const formatParameterTableData = (tableHeadings, tableValues) => {
  const tableValuesWithHeadings =
    tableValues[0] &&
    tableValues.map((eachArray, index1) => {
      return eachArray.map((eachItem) => {
        return {
          [tableHeadings[index1]]: eachItem,
        };
      });
    });

  const formattedTableData =
    tableValuesWithHeadings &&
    tableValuesWithHeadings.reduce((acc, currArray) => {
      currArray.forEach((eachItem, index) => {
        acc[index] = { ...acc[index], ...eachItem };
      });

      return acc;
    }, []);

  const formattedTableDataWithIndex =
    formattedTableData &&
    formattedTableData.map(function (currentValue, index) {
      currentValue.index = index + 1;
      return currentValue;
    });

  return formattedTableDataWithIndex;
};

const convertParameterDateStringsToObjects = (deviceData, parameterName) => {
  // Create a copy of original parameter data
  const parameterData = deviceData && parameterName && Object.assign({}, deviceData[parameterName]);
  const { dates } = parameterData || {};

  // Convert dates to objects for easy manipulation
  const parameterDateObjects = convertDateStringsToObjects(
    dates?.dates || dates
  );
  // Add date objects and device name to data
  if (parameterData) {
    parameterData.dates = parameterDateObjects || null;
  }

  return { ...parameterData, dates: parameterDateObjects };
};

// modify date in report to the right format
const modifyStatisTicDate = (date) => {
  const dateWithoutBracket = date.replace(/[()]/g, '');
  const dateDay = dateWithoutBracket.split(" ")[0];
  const dateOnly = new Date(dateWithoutBracket.substr(dateWithoutBracket.indexOf(" ") + 1)).toLocaleDateString();
  return `(${dateDay}, ${dateOnly})`;
};

const modifyStatisTicDateWithTime = (date) => {
  const dateWithoutBracket = date.replace(/[()]/g, '');
  const dateDay = dateWithoutBracket.split(" ")[0];
  const splitString = dateWithoutBracket.substr(dateWithoutBracket.indexOf(" ") + 1).split(" ");
  let deteOnlySlice = splitString.slice(0, splitString.length - 1).join(' ');
  const deteOnly = new Date(deteOnlySlice).toLocaleDateString();
  let timeOnly = splitString.slice(splitString.length - 1)[0];

  if (timeOnly[timeOnly.length - 1] === '.') {
    timeOnly = timeOnly.substring(0, timeOnly.length - 1);
  }
  return { dateDay, deteOnly, timeOnly }
};
/* -------------------------------------------------------------------
/* Parameter Helpers End ---------------------------------------------
--------------------------------------------------------------------*/



/* -------------------------------------------------------------------
/* Load overview Helpers Start ---------------------------------------
--------------------------------------------------------------------*/
const generateLoadCosumptionChartData = (isLoadData) => {
  let label = [];
  let data = []
  isLoadData.map((device) => {
    label.push(device.name);
    data.push(device.consumption);
  });

  return { label, data };
}

const generateLoadOverviewChartData = (isLoadData) => {

  let label = [];
  let initailData = []
  let data = []



  if (isLoadData) {
    isLoadData?.map((device) => {
      if (device.is_load) {

        initailData.push(device.dashboard.total_kwh.value);
      }

    });
    const sumData = sumOfArrayElements(initailData);
    isLoadData?.map((device) => {
      if (device.is_load) {
        const devicePercentage = calculatePercentageTwoDecimal(device.dashboard.total_kwh.value, sumData);
        label.push(device.name);
        data.push(devicePercentage);
      }
    });
  }
  return { label, data };
}

const generateMultipleBranchLoadOverviewChartData = (allBranch) => {

  let label = [];
  let data = [];
  let branchConsumptionKeyPair = {};
  let totalConsumptionUnit = 0;

  allBranch.map((branch) => {
    let totalBranchUsage = 0
    branch.devices.map((device) => {
      if (device.is_load) {
        totalBranchUsage += device.dashboard?.total_kwh?.value;
        totalConsumptionUnit += device.dashboard?.total_kwh?.value;
      }
    });
    branchConsumptionKeyPair[branch.name] = totalBranchUsage;
  });

  Object.entries(branchConsumptionKeyPair).forEach(
    ([key, value]) => {
      const percentage = calculatePercentageTwoDecimal(value, totalConsumptionUnit);
      label.push(key);
      data.push(percentage);
    }
  );


  return { label, data };
}

const generateRunningTimeChartData = (branch) => {
  let label = [];
  let data = []
  branch.map((device) => {
    label.push(device.name);
    data.push(device.device_runtime);
  });

  return { label, data };
}
const generateSumLoadConsumption = (branch) => {
  let initailData = [];
  branch.map((device) => {
    initailData.push(device.consumption);
  });
  return sumOfArrayElements(initailData);
}

const refineLoadOverviewData = (allDeviceData) => {
  let branchData = {};
  allDeviceData.map((eachData) => {
    const branchName = eachData.branchName;
    if (eachData.is_load) {
      if (branchData[branchName]) {
        branchData[branchName].push(eachData);
      } else {
        branchData[branchName] = [eachData];
      }
    }
  })
  return branchData;
}

const generateSumOfIsSource = (allDeviceData) => {
  let sum = 0;
  allDeviceData.map((eachData) => {
    if (eachData.is_source) {
      sum += eachData.consumption;
    }
  })
  return sum;
};

/* -------------------------------------------------------------------
/* Load overview Helpers End  ----------------------------------------
--------------------------------------------------------------------*/

// Endpoint Month and Year parameters statrts
export const getMonthYear = (date = new Date()) => {
  return {
    month: dayjs(date).month() + 1,
    year: dayjs(date).year(),
  };
};
// Endpoint Month and Year parameters ends

const validate2DecNo = (value, label) => {
  const numbersOnly = (/^\s*-?\d+(\.\d{1,2})?\s*$/);
  const validAmountReg = (/^\d{0,16}?(\.[0-9]{0,4})?$/);
  if (value
    && (!value.toString().match(numbersOnly))
  ) {
    return Promise.reject(new Error(`Please enter a valid ${label}`));
  }
  if (value
    && (!value.toString().match(validAmountReg))) {
    return Promise.reject(new Error('Limit connot be more than 999999999999999999.99'));
  }
  return Promise.resolve();
};

const sortArrayOfObjectByDate = (array) => {
  if (array && array !== undefined && array.length > 0) {
    return array.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  }
  return [];

}

// Method for converting dates to endpoint format
const convertDateRangeToEndpointFormat = (dateObjects) =>
  dateObjects
    .map((eachDateObject) => eachDateObject.format('DD-MM-YYYY HH:mm'))
    .join('/');


const generateAppDateRange = (newEndpointDateRange) => {
  // Update endpoint if available
  const datdata = newEndpointDateRange
    ? convertDateRangeToEndpointFormat(newEndpointDateRange)
    : (convertDateRangeToEndpointFormat([
      dayjs().startOf('month'),
      dayjs(),
    ]));
  return datdata;
};

// data to combine multiple dates data of the same month
const combineSameMonthData = (dateArray) => {
  let forcastedData = {};
  let usedData = {};
  if (dateArray.length > 0) {
    dateArray.map((data) => {
      if (forcastedData[data.date] != null) {
        forcastedData[data.date] = Number(data.forecast) + forcastedData[data.date];
      } else {
        forcastedData[data.date] = Number(data.forecast);
      }
      if (usedData[data.date] != null) {
        usedData[data.date] = usedData[data.date] + Number(data.used);
      } else {
        usedData[data.date] = Number(data.used);
      }

    })
  }
  return { forcastedData, usedData };
}
// data to combine multiple dates data of the same month
const sortByDateTime = (data) => {
  return data.sort(function (a, b) {
    return new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`);
  });
}
// data to combine multiple dates data of the same month
const convertDecimalTimeToNormal = (d) => {
  // const n = new Date(0,0);
  // n.setSeconds(+decimalTimeString * 60 * 60);
  // return (n.toTimeString().slice(0, 8));
  // const hours = Math.floor(decimalTimeString / 60);  
  // const minutes = decimalTimeString % 60;
  // return `${hours}:${minutes}`; 
    var h = Math.floor(d);

    var m = (d - h) * 60;
    // var m = Math.floor(d % 3600 / 60);
    // var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    var mDisplay = m > 0 ? m.toFixed(0) + (m == 1 ? " min" : " mins") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return hDisplay + mDisplay;
}


const calculateDemandMinMaxAvgValues = (data) => {
  let max_demand = 0;
  let avg_demand = 0;
  let totalMin = 0;
  let countMin = 0;

  data.forEach(device => {
    max_demand = Math.max(max_demand, device.max);
    avg_demand = Math.max(avg_demand, device.avg);
    if (Number(device.min) !== 0) {
      totalMin += device.min;
    }
    countMin++;
  });

  const min_demand = countMin > 0 ? totalMin / countMin : 0;

  return {
    max_demand,
    avg_demand,
    min_demand
  };
}


export {
  daysInMonth,
  getPeakToAverageMessage,
  getBaselineEnergyColor,
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  checkIsGenStatus,
  sumArrayOfArrays,
  combineArrayData,
  calculateRatio,
  calculatePercentage,
  calculatePercentageTwoDecimal,
  getAllOrganizationDevices,
  sumObjectValuesUp,
  sumNestedObjectValuesUp,
  getModifiedBranchLevelData,
  getMinDemandObject,
  getMaxDemandObject,
  getAvgDemandObject,
  getMinDemandObjectKVA,
  getMaxDemandObjectKVA,
  getAvgDemandObjectKVA,
  getNestedMinDemandObject,
  getNestedMaxDemandObject,
  getNestedAvgDemandObject,
  cloneObject,
  getLastArrayItems,
  sumBaselineEnergies,
  sumPeakToAveragePowerRatios,
  sumScoreCardCarbonEmissions,
  joinChangeOverLagsValues,
  sumOperatingTimeValues,
  convertDateStringToObject,
  convertDateStringsToObjects,
  formatParametersDatetimes,
  formatParametersDates,
  formatParametersTimes,
  formatParameterTableData,
  convertParameterDateStringsToObjects,
  removeDuplicateDatas,
  truncateEmail,
  mergeTheData,
  allDeviceGenerators,
  roundToDecimalPLace,
  sumOfArrayElements,
  modifyStatisTicDate,
  modifyStatisTicDateWithTime,
  generateLoadCosumptionChartData,
  generateRunningTimeChartData,
  refineLoadOverviewData,
  generateLoadOverviewChartData,
  generateMultipleBranchLoadOverviewChartData,
  generateSumLoadConsumption,
  generateSumOfIsSource,
  validate2DecNo,
  sortArrayOfObjectByDate,
  generateAppDateRange,
  allCheckedDeviceGenerators,
  allCostTrackerBranchesBaseline,
  getGeneratorSizeMessage,
  combineSameMonthData,
  sortByDateTime,
  getNestedMinDemandObjectKVA,
  getNestedMaxDemandObjectKva,
  getNestedAvgDemandObjectKva,
  convertDecimalTimeToNormal,
  calculateDemandMinMaxAvgValues
};
