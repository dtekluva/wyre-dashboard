import axios from "axios";
import deviceHttp from "./devices";

const baseUrl = process.env.REACT_APP_API_URL;

const getAll = (userId, token, dateRange) => {
  const dateData =
    dateRange.length > 0
      ? deviceHttp.convertDateRangeToEndpointFormat(dateRange)
      : deviceHttp.endpointDateRange.split("/")[0];
  const request = axios.get(
    `${baseUrl}get_reports/${userId}/${dateData}/monthly`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
    }
  );
  return request.then((response) => response.data.data);
};
const dateData = deviceHttp.endpointDateRange.split("/")[0];

// eslint-disable-next-line
export default {
  getAll,
  dateData,
};
