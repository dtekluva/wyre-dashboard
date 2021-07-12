import dayjs from 'dayjs';

/* --------------------------------------------------------------------
/* Completely Generic Helpers ------------------------------------------
--------------------------------------------------------------------*/

function removeDuplicateDatas(value, index, self) {
  return self.indexOf(value) === index;
}

const truncateEmail = (str, num)=>{
  if(str.length <= num)
  {
    return str
  }
  return str.slice(0,num) + '...'
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
  return array.slice(Math.max(array.length - numberOfItems, 0));
};

/*
 * Sum up values a the same index in each array found in a wrapper array
 * @param  {Array}   arrayOfArrays  an array which contains other arrays of numbers
 */
const sumArrayOfArrays = (arrayOfArrays) =>
  arrayOfArrays.reduce((acc, curr) => {
    curr.forEach((innerArrayItem, index) => {
      acc[index] = (acc[index] || 0) + innerArrayItem;
    });
    return acc;
  }, []);

const calculateRatio = (num_1, num_2) => {
  // for (let num = num_2; num > 1; num--) {
  //   if (num_1 % num === 0 && num_2 % num === 0) {
  //     num_1 = num_1 / num;
  //     num_2 = num_2 / num;
  //   }
  // }

  let peak_ratio = (num_1/num_2)
  num_1 = peak_ratio%1 === 0 ? peak_ratio.toFixed(0): peak_ratio.toFixed(1)
  num_2 = 1

  const ratio = num_1 + ':' + num_2;
  return ratio;
};

const calculatePercentage = (num_1, num_2) => ((num_1 / num_2) * 100).toFixed();
// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

// -------------------------------------------------------------------

const getAllOrganizationDevices = (data) => {
  return (
    data.branches &&
    data.branches
      .map((eachBranch) => {
        // Add branch name to each device name
        eachBranch.devices.forEach((device) => {
          // Prevent process from repeating several times
          if (!device.name.includes(eachBranch.name))
            device.name = eachBranch.name + ' ' + device.name;
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
  const valuesArray = array.map(
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
  // Pick out values and place them in array(s)
  const valuesArray = array.map(
    (eachItem) =>
      eachItem[nestedObject][valueName] &&
      eachItem[nestedObject][valueName].value
  );

  const unitsArray = array.map(
    (eachItem) =>
      eachItem[nestedObject][valueName] &&
      eachItem[nestedObject][valueName].unit
  );

  // Sum up values in each array
  const valuesTotal = valuesArray.reduce((acc, curr) => acc + curr, 0);

  return { unit: unitsArray[0], value: valuesTotal };
};

const getMinDemandObject = (array) => {
  const valuesArray = array.map((eachItem) => eachItem.min_demand.value);

  //Obtain min demand of all min demands
  const valuesArrayMin = Math.min.apply(null, valuesArray);

  return { unit: 'kw', value: valuesArrayMin };
};

const getNestedMinDemandObject = (array, nestedObject) => {
  const valuesArray = array.map(
    (eachItem) => eachItem[nestedObject].min_demand.value
  );

  //Obtain min demand of all min demands
  const valuesArrayMin = Math.min.apply(null, valuesArray);

  return { unit: 'kw', value: valuesArrayMin };
};

const getMaxDemandObject = (array) => {
  const valuesArray = array.map((eachItem) => eachItem.max_demand.value);

  //Obtain max demand of all max demands
  const valuesArrayMax = Math.max.apply(null, valuesArray);

  return { unit: 'kw', value: valuesArrayMax };
};

const getNestedMaxDemandObject = (array, nestedObject) => {
  const valuesArray = array.map(
    (eachItem) => eachItem[nestedObject].max_demand.value
  );

  //Obtain max demand of all max demands
  const valuesArrayMax = Math.max.apply(null, valuesArray);

  return { unit: 'kw', value: valuesArrayMax };
};

const getAvgDemandObject = (array) => {
  const valuesArray = array.map((eachItem) => eachItem.avg_demand.value);

  //Obtain avg demand of all avg demands
  const valuesArrayAvg =
    valuesArray.reduce((acc, curr) => acc + curr, 0) / valuesArray.length;

  return { unit: 'kw', value: valuesArrayAvg };
};

const getNestedAvgDemandObject = (array, nestedObject) => {
  const valuesArray = array.map(
    (eachItem) => eachItem[nestedObject].avg_demand.value
  );

  //Obtain avg demand of all avg demands
  const valuesArrayAvg =
    valuesArray.reduce((acc, curr) => acc + curr, 0) / valuesArray.length;

  return { unit: 'kw', value: valuesArrayAvg };
};
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
  const forecastValues = array.map((eachItem) => eachItem.forecast);
  const usedValues = array.map((eachItem) => eachItem.used);
  const forecastTotal = forecastValues.reduce((acc, curr) => acc + curr, 0);
  const usedTotal = usedValues.reduce((acc, curr) => acc + curr, 0);

  return { unit: 'kwh', forecast: forecastTotal, used: usedTotal };
};

const sumPeakToAveragePowerRatios = (array) => {
  const peakValues = array.map((eachItem) => eachItem.peak);
  const avgValues = array.map((eachItem) => eachItem.avg);

  const peakOfPeakValues = Math.max.apply(null, peakValues);
  const avgOfAvgValues =
    avgValues.reduce((acc, curr) => acc + curr, 0) / avgValues.length;

  return { unit: 'kw', peak: peakOfPeakValues, avg: avgOfAvgValues };
};

const sumScoreCardCarbonEmissions = (array) => {
  const estimatedValues = array.map((eachItem) => eachItem.estimated_value);
  const actualValues = array.map((eachItem) => eachItem.actual_value);

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
        eachDevice.score_card.change_over_lags &&
        eachDevice.score_card.change_over_lags[nestedValue].values
    )
    .filter(Boolean);
};

const sumOperatingTimeValues = (parentArray, nestedValueName) => {
  return parentArray
    .map(
      (eachDevice) =>
        eachDevice.score_card.operating_time[nestedValueName] &&
        eachDevice.score_card.operating_time[nestedValueName].value
    )
    .filter(Boolean)
    .reduce((acc, curr) => acc + curr, 0);
};
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
  return dateStrings.map((eachDate) => dayjs(eachDate));
};

const formatParametersDatetimes = (dateStrings) => {
  return dateStrings.map((eachDate) => eachDate.format('DD/MM/YYYY h:mm A'));
};

const formatParametersDates = (dateStrings) => {
  return dateStrings.map((eachDate) => eachDate.format('DD/MM/YYYY'));
};

const formatParametersTimes = (dateStrings) => {
  return dateStrings.map((eachDate) => eachDate.format('hh:mm A'));
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
  const parameterData = Object.assign({}, deviceData[parameterName]);
  const { dates } = parameterData;

  // Convert dates to objects for easy manipulation
  const parameterDateObjects = convertDateStringsToObjects(
    dates.dates || dates
  );
  // Add date objects and device name to data
  parameterData.dates = parameterDateObjects;

  return { ...parameterData, dates: parameterDateObjects };
};
/* -------------------------------------------------------------------
/* Parameter Helpers End ---------------------------------------------
--------------------------------------------------------------------*/

export {
  toCamelCase,
  toKebabCase,
  toSnakeCase,
  sumArrayOfArrays,
  calculateRatio,
  calculatePercentage,
  getAllOrganizationDevices,
  sumObjectValuesUp,
  sumNestedObjectValuesUp,
  getModifiedBranchLevelData,
  getMinDemandObject,
  getMaxDemandObject,
  getAvgDemandObject,
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
  truncateEmail
};
