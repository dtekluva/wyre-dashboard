import axios from 'axios';
import dayjs from 'dayjs';

// Base URL prefix
let baseUrlPrefix = `https://wyreng.xyz/api/v1/dashboard`;

// Handle determination of token
let token = undefined;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

// Handle determination of userID
let userId = '';

const setUserId = (newUserId) => {
  userId = newUserId;
};

// Method for converting dates to endpoint format
const convertDateRangeToEndpointFormat = (dateObjects) =>
  dateObjects
    .map((eachDateObject) => eachDateObject.format('DD-MM-YYYY HH:mm'))
    .join('/');

    // Handle determination of date range for url
let endpointDateRange = convertDateRangeToEndpointFormat([
  dayjs().startOf('month'),
  dayjs(),
]);

const setEndpointDateRange = (newEndpointDateRange) => {
  // Update endpoint if available
  endpointDateRange = newEndpointDateRange
    ? convertDateRangeToEndpointFormat(newEndpointDateRange)
    : (endpointDateRange = convertDateRangeToEndpointFormat([
        dayjs().startOf('month'),
        dayjs(),
      ]));
};


// Handle Manipulation of time interval for url
let endpointDataTimeInterval = 'hourly';

const setEndpointDataTimeInterval = (newEndpointDataTimeInterval) => {
  endpointDataTimeInterval = newEndpointDataTimeInterval;
};

const getAllData = async () => {
  // Add interval to url
  const baseUrl = `${baseUrlPrefix}/${userId}/${endpointDateRange}/${endpointDataTimeInterval}`;
  //const test =axios.get('https://wyreng.xyz/api/v1/dashboard/6/01-12-2021%2000:00/01-04-2021%2000:00/hourly');
  //console.log(test)
  const config = {
    headers: { Authorization: token },
  };

  //const resp = await axios.get(test, config);
  //console.log(resp.data.authenticatedData);

  const response = await axios.get(baseUrl, config);
  //console.log(response.data.authenticatedData.branches[0].devices[0].score_card.is_generator);
  return response.data.authenticatedData;  
};

// eslint-disable-next-line
export default {
  getAllData,
  setToken,
  setUserId,
  setEndpointDateRange,
  setEndpointDataTimeInterval,
  convertDateRangeToEndpointFormat,
  endpointDateRange,
  userId,
  token
};
