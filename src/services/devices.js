import axios from 'axios';
import dayjs from 'dayjs';

// Base URL prefix
let baseUrlPrefix = `https://wyreng.xyz/api/v1/dashboard`;
// let baseUrlPrefix = `http://localhost:8000/api/v1/dashboard`;

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
  
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.get(baseUrl, config);
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
