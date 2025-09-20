import {
  getCo2EmissionLoading,
    getCo2EmissionSuccess,
    getCostAnalysisLoading,
    getCostAnalysisSuccess,
    getDieselPriceLoading,
    getDieselPriceSuccess,
    getFuelUsageLoading,
    getFuelUsageSuccess,
    getGeneratorMonthlyEnergyLoading,
    getGeneratorMonthlyEnergySuccess,
    getGeneratorsStatusLoading,
    getGeneratorsStatusSuccess,
    getGenFuelUsageLoading,
    getGenFuelUsageSuccess,
    getGenStatusChartLoading,
    getGenStatusChartSuccess,
    getOperationalEfficiencyLoading,
    getOperationalEfficiencySuccess
} from "./actionCreators";
import { APIService } from "../../../config/api/apiConfig";
import jwtDecode from "jwt-decode";
import { message } from "antd";
import { getMonthYear } from "../../../helpers/genericHelpers";

export const fetchBranchGeneratorsStatusData = () => async (dispatch) => {
  dispatch(getGeneratorsStatusLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const requestUrl = `branch/${branchId}/generators-status/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getGeneratorsStatusSuccess(response.data));
    dispatch(getGeneratorsStatusLoading(false))
  } catch (error) {
    dispatch(getGeneratorsStatusLoading(false));
  }
};

export const fetchCoEmissionData = (date) => async (dispatch) => {
  dispatch(getCo2EmissionLoading());
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
  const requestUrl = `branch/${branchId}/generators-co2/?month=${month}&year=${year}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getCo2EmissionSuccess(response.data));
    dispatch(getCo2EmissionLoading(false))
  } catch (error) {
    dispatch(getCo2EmissionLoading(false));
  }
};

export const fetchDieselPriceData = () => async (dispatch) => {
  dispatch(getDieselPriceLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const requestUrl = `branch/${branchId}/diesel-price/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getDieselPriceSuccess(response.data.data));
    dispatch(getDieselPriceLoading(false))
  } catch (error) {
    dispatch(getDieselPriceLoading(false));
  }
};

export const fetchGenTotalEnergyUsedData = () => async (dispatch) => {
  dispatch(getGeneratorMonthlyEnergyLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
  }
  const requestUrl = `branch/${branchId}/generators-monthly-energy/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getGeneratorMonthlyEnergySuccess(response.data));
    dispatch(getGeneratorMonthlyEnergyLoading(false))
  } catch (error) {
    dispatch(getGeneratorMonthlyEnergyLoading(false));
  }
};

export const fetchGenStatusChartData = (date) => async (dispatch) => {
  dispatch(getGenStatusChartLoading());
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
  const requestUrl = `branch/${branchId}/generator-runtime-fuel-usage/?month=${month}&year=${year}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getGenStatusChartSuccess(response.data));
    dispatch(getGenStatusChartLoading(false))
  } catch (error) {
    dispatch(getGenStatusChartLoading(false));
  }
};

export const fetchGenFuelUsageData = (date, frequency) => async (dispatch) => {
  dispatch(getGenFuelUsageLoading());
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
  const initUrl = `branch/${branchId}/generator-energy-fuel-series/?month=${month}&year=${year}`
  const reqUrl = frequency ? initUrl + `&frequency=${frequency}` : initUrl
  try {
    const response = await APIService.get(reqUrl);
    dispatch(getGenFuelUsageSuccess(response.data));
    dispatch(getGenFuelUsageLoading(false))
  } catch (error) {
    dispatch(getGenFuelUsageLoading(false));
  }
};

export const fetchFuelUsageData = (date, frequency) => async (dispatch) => {
  dispatch(getFuelUsageLoading());
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
  const initUrl = `branch/${branchId}/fuel-usage-series/?month=${month}&year=${year}`
  const reqUrl = frequency ? initUrl + `&frequency=${frequency}` : initUrl
  try {
    const response = await APIService.get(reqUrl);
    dispatch(getFuelUsageSuccess(response.data));
    dispatch(getFuelUsageLoading(false))
  } catch (error) {
    dispatch(getFuelUsageLoading(false));
  }
};

export const fetchGenMetricsData = (date) => async (dispatch) => {
  dispatch(getOperationalEfficiencyLoading());
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
  const requestUrl = `branch/${branchId}/generator-metrics/?month=${month}&year=${year}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getOperationalEfficiencySuccess(response.data));
    dispatch(getOperationalEfficiencyLoading(false))
  } catch (error) {
    dispatch(getOperationalEfficiencyLoading(false));
  }
};

export const fetchCostMetricsData = (date) => async (dispatch) => {
  dispatch(getCostAnalysisLoading());
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
  const requestUrl = `branch/${branchId}/cost-metrics/?month=${month}&year=${year}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getCostAnalysisSuccess(response.data));
    dispatch(getCostAnalysisLoading(false))
  } catch (error) {
    dispatch(getCostAnalysisLoading(false));
  }
};