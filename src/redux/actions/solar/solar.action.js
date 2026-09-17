import { APIService } from "../../../config/api/apiConfig";
import { jwtDecode } from 'jwt-decode';
import { getMonthYear } from "../../../helpers/genericHelpers";
import {
  getWeatherReadingsLoading,
  getWeatherReadingsSuccess,
  getComponentsTableLoading,
  getComponentsTableSuccess,
  getInverterGridsLoading,
  getInverterGridsSuccess,
  getConsumptionChartLoading,
  getConsumptionChartSuccess,
  getPvProductionChartLoading,
  getPvProductionChartSuccess,
  getBatteryChartLoading,
  getBatteryChartSuccess,
  getSolarLiveLoading,
  getSolarLiveSuccess,
} from "./actionCreators";

const getSolarBranchId = () => {
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  if (!loggedUserJSON) return null;
  const userToken = JSON.parse(loggedUserJSON);
  const user = jwtDecode(userToken.access);
  return user.branch_id;
};

const unwrapSolarPayload = (response) => response.data?.data ?? response.data;

export const fetchWeatherReadingsData = () => async (dispatch) => {
  dispatch(getWeatherReadingsLoading());
  const branchId = getSolarBranchId();
  if (!branchId) {
    dispatch(getWeatherReadingsLoading(false));
    return;
  }
  const requestUrl = `solar/overview/${branchId}/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getWeatherReadingsSuccess(response.data));
    dispatch(getWeatherReadingsLoading(false));
  } catch (error) {
    dispatch(getWeatherReadingsLoading(false));
  }
};

export const fetchComponentsTableData = () => async (dispatch) => {
  dispatch(getComponentsTableLoading());
  const branchId = getSolarBranchId();
  if (!branchId) {
    dispatch(getComponentsTableLoading(false));
    return;
  }
  const requestUrl = `solar/yield/${branchId}/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getComponentsTableSuccess(unwrapSolarPayload(response)));
    dispatch(getComponentsTableLoading(false));
  } catch (error) {
    dispatch(getComponentsTableLoading(false));
  }
};

export const fetchInverterGridsData = () => async (dispatch) => {
  dispatch(getInverterGridsLoading());
  const branchId = getSolarBranchId();
  if (!branchId) {
    dispatch(getInverterGridsLoading(false));
    return;
  }
  const requestUrl = `solar/site-status/${branchId}/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getInverterGridsSuccess(response.data));
    dispatch(getInverterGridsLoading(false));
  } catch (error) {
    dispatch(getInverterGridsLoading(false));
  }
};

export const fetchSolarLiveData = ({ silent = false } = {}) => async (dispatch) => {
  if (!silent) {
    dispatch(getSolarLiveLoading(true));
  }
  const branchId = getSolarBranchId();
  if (!branchId) {
    if (!silent) dispatch(getSolarLiveLoading(false));
    return;
  }
  const requestUrl = `solar/live/${branchId}/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getSolarLiveSuccess(unwrapSolarPayload(response)));
    if (!silent) dispatch(getSolarLiveLoading(false));
  } catch (error) {
    if (!silent) dispatch(getSolarLiveLoading(false));
  }
};

export const fetchConsumptionsData = (date, day) => async (dispatch) => {
  dispatch(getConsumptionChartLoading());
  const { month, year } = getMonthYear(date);
  const branchId = getSolarBranchId();
  if (!branchId) {
    dispatch(getConsumptionChartLoading(false));
    return;
  }
  const initUrl = `solar/${branchId}/consumption-hourly-plot/?month=${month}&year=${year}`;
  const reqUrl = day ? `${initUrl}&day=${day}` : initUrl;
  try {
    const response = await APIService.get(reqUrl);
    dispatch(getConsumptionChartSuccess(unwrapSolarPayload(response)));
    dispatch(getConsumptionChartLoading(false));
  } catch (error) {
    dispatch(getConsumptionChartLoading(false));
  }
};

export const fetchPvProductionData = (date, day) => async (dispatch) => {
  dispatch(getPvProductionChartLoading());
  const { month, year } = getMonthYear(date);
  const branchId = getSolarBranchId();
  if (!branchId) {
    dispatch(getPvProductionChartLoading(false));
    return;
  }
  const initUrl = `solar/${branchId}/pv-production-hourly-plot/?month=${month}&year=${year}`;
  const reqUrl = day ? `${initUrl}&day=${day}` : initUrl;
  try {
    const response = await APIService.get(reqUrl);
    dispatch(getPvProductionChartSuccess(unwrapSolarPayload(response)));
    dispatch(getPvProductionChartLoading(false));
  } catch (error) {
    dispatch(getPvProductionChartLoading(false));
  }
};

export const fetchBatterySystemData = (date, day) => async (dispatch) => {
  dispatch(getBatteryChartLoading());
  const { month, year } = getMonthYear(date);
  const branchId = getSolarBranchId();
  if (!branchId) {
    dispatch(getBatteryChartLoading(false));
    return;
  }
  const initUrl = `solar/${branchId}/battery-backup-hourly-plot/?month=${month}&year=${year}`;
  const reqUrl = day ? `${initUrl}&day=${day}` : initUrl;
  try {
    const response = await APIService.get(reqUrl);
    dispatch(getBatteryChartSuccess(unwrapSolarPayload(response)));
    dispatch(getBatteryChartLoading(false));
  } catch (error) {
    dispatch(getBatteryChartLoading(false));
  }
};
