// import {
//     getWeatherReadingsLoading,
//     getWeatherReadingsSuccess
// } from "./actionCreators";
import { APIService } from "../../../config/api/apiConfig";
import jwtDecode from "jwt-decode";
import { message } from "antd";
import { getMonthYear } from "../../../helpers/genericHelpers";
import { getWeatherReadingsLoading, getWeatherReadingsSuccess, getComponentsTableLoading, getComponentsTableSuccess, getInverterGridsLoading, getInverterGridsSuccess, getConsumptionChartLoading, getConsumptionChartSuccess, getPvProductionChartLoading, getPvProductionChartSuccess, getBatteryChartLoading, getBatteryChartSuccess } from "./actionCreators";

export const fetchWeatherReadingsData = () => async (dispatch) => {
  dispatch(getWeatherReadingsLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const requestUrl = `solar/overview/${branchId}/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getWeatherReadingsSuccess(response.data));
    dispatch(getWeatherReadingsLoading(false))
  } catch (error) {
    dispatch(getWeatherReadingsLoading(false));
  }
};

export const fetchComponentsTableData = () => async (dispatch) => {
  dispatch(getComponentsTableLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const requestUrl = `solar/yield/${branchId}/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getComponentsTableSuccess(response.data));
    dispatch(getComponentsTableLoading(false))
  } catch (error) {
    dispatch(getComponentsTableLoading(false));
  }
};

export const fetchInverterGridsData = () => async (dispatch) => {
  dispatch(getInverterGridsLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const requestUrl = `solar/site-status/${branchId}/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getInverterGridsSuccess(response.data));
    dispatch(getInverterGridsLoading(false))
  } catch (error) {
    dispatch(getInverterGridsLoading(false));
  }
};

export const fetchConsumptionsData = (date, day) => async (dispatch) => {
  dispatch(getConsumptionChartLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  const { month, year } = getMonthYear(date);
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const initUrl = `solar/${branchId}/consumption-hourly-plot/?month=${month}&year=${year}`
  const reqUrl = day ? initUrl + `&day=${day}` : initUrl
  try {
    const response = await APIService.get(reqUrl);
    dispatch(getConsumptionChartSuccess(response.data));
    dispatch(getConsumptionChartLoading(false))
  } catch (error) {
    dispatch(getConsumptionChartLoading(false));
  }
};

export const fetchPvProductionData = (date, day) => async (dispatch) => {
  dispatch(getPvProductionChartLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  const { month, year } = getMonthYear(date);
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const initUrl = `solar/${branchId}/pv-production-hourly-plot/?month=${month}&year=${year}`
  const reqUrl = day ? initUrl + `&day=${day}` : initUrl
  try {
    const response = await APIService.get(reqUrl);
    dispatch(getPvProductionChartSuccess(response.data));
    dispatch(getPvProductionChartLoading(false))
  } catch (error) {
    dispatch(getPvProductionChartLoading(false));
  }
};

export const fetchBatterySystemData = (date, day) => async (dispatch) => {
  dispatch(getBatteryChartLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  const { month, year } = getMonthYear(date);
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const initUrl = `solar/${branchId}/battery-backup-hourly-plot/?month=${month}&year=${year}`
  const reqUrl = day ? initUrl + `&day=${day}` : initUrl
  try {
    const response = await APIService.get(reqUrl);
    dispatch(getBatteryChartSuccess(response.data));
    dispatch(getBatteryChartLoading(false))
  } catch (error) {
    dispatch(getBatteryChartLoading(false));
  }
};