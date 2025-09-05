import {
    getDieselPriceLoading,
    getDieselPriceSuccess,
    getGeneratorMonthlyEnergyLoading,
    getGeneratorMonthlyEnergySuccess,
    getGeneratorsStatusLoading,
    getGeneratorsStatusSuccess
} from "./actionCreators";
import { APIService } from "../../../config/api/apiConfig";
import jwtDecode from "jwt-decode";
import { message } from "antd";


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

export const fetchBranchGeneratorMonthlyEnergyData = () => async (dispatch) => {
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