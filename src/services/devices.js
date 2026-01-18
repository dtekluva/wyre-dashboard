import axios from 'axios';
import dayjs from 'dayjs';
import { jwtDecode } from 'jwt-decode';
// import dashBoardMock from '../mock/dashboard';

// Base URL prefix
let baseUrlPrefix = `https://backend.wyreng.com/api/v1/dashboard`;

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

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;

  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  const baseUrl = `${baseUrlPrefix}/${userId}/${endpointDateRange}/${endpointDataTimeInterval}`;
  //const test =axios.get('https://backend.wyreng.com/api/v1/dashboard/6/01-12-2021%2000:00/01-04-2021%2000:00/hourly');
  //console.log(test)
  // const config = {
  //   headers: { Authorization:`Bearer ${token}`  },
  // };
  const config = null;

  //const resp = await axios.get(test, config);
  //console.log(resp.data.authenticatedData);

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
  token,
  endpointDataTimeInterval
};
