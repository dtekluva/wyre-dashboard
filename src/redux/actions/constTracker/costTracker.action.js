
import {
  fetchCostTrackerLoading, fetchCostTrackerSuccess, addFuelDataSuccess,
  fetchFuelDataLoading, fetchFuelDataSuccess, addFuelDataLoading, editFuelDataLoading, editFuelDataSuccess, deleteFuelDataLoading, deleteFuelDataSuccess, editFuelPUrchaseDataLoading, editFuelPUrchaseDataSuccess, editPreUtilityPurchaseDataLoading, editPreUtilityPurchaseDataSuccess, editPostUtilityPurchaseDataLoading, editPostUtilityPurchaseDataSuccess, deleteFuelPUrchaseDataLoading, deleteFuelPUrchaseDataSuccess, deletePreUtilityPurchaseDataLoading, deletePreUtilityPurchaseDataSuccess, editIppPurchaseDataLoading, editIppPurchaseDataSuccess, deleteIppPurchaseDataLoading, deleteIppPurchaseDataSuccess, addMonthlyFuelDataLoading, addMonthlyFuelDataSuccess,
  fetchGeneratorListsLoading,
  fetchGeneratorListsSuccess,
  fetchDieselOverviewLoading,
  fetchDieselOverviewSuccess,
  fetchCostTrackerOverviewLoading,
  fetchCostTrackerOverviewSuccess,
  fetchUtilityOverviewLoading,
  fetchUtilityOverviewSuccess,
  fetchCostTrackerBaselineLoading,
  fetchCostTrackerBaselineSuccess,
  fetchIppOverviewLoading,
  fetchIppOverviewSuccess,
  fetchDieselDailyUsageLoading,
  fetchDieselDailyUsageSuccess,
  fetchDieselMonthlyUsageLoading,
  fetchDieselMonthlyUsageSuccess
} from "./actionCreators";
import { APIService } from "../../../config/api/apiConfig";
import { jwtDecode } from 'jwt-decode';
import { message } from "antd";


export const fetchCostTrackerData = () => async (dispatch) => {
  dispatch(fetchCostTrackerLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
  }
  const requestUrl = `cost_tracker_overview/${userId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchCostTrackerSuccess(response.data.data));
    dispatch(fetchCostTrackerLoading(false))
  } catch (error) {
    dispatch(fetchCostTrackerLoading(false));
  }
};

export const getCostTrackerOverviewData = (branchId) => async (dispatch) => {
  dispatch(fetchCostTrackerOverviewLoading());
  const requestUrl = `cost-tracker/branch-overview/${branchId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchCostTrackerOverviewSuccess(response.data.data));
    dispatch(fetchCostTrackerOverviewLoading(false))
  } catch (error) {
    dispatch(fetchCostTrackerOverviewLoading(false));
  }
};

export const getDieselOverviewData = (branchId) => async (dispatch) => {
  dispatch(fetchDieselOverviewLoading());
  const requestUrl = `cost-tracker/diesel-overview/${branchId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchDieselOverviewSuccess(response.data.data));
    dispatch(fetchDieselOverviewLoading(false))
  } catch (error) {
    dispatch(fetchDieselOverviewLoading(false));
  }
};

export const getUtilityOverviewData = (branchId) => async (dispatch) => {
  dispatch(fetchUtilityOverviewLoading());
  const requestUrl = `cost-tracker/utility-overview/${branchId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchUtilityOverviewSuccess(response.data.data));
    dispatch(fetchUtilityOverviewLoading(false))
  } catch (error) {
    dispatch(fetchUtilityOverviewLoading(false));
  }
};

export const getIppOverviewData = (branchId) => async (dispatch) => {
  dispatch(fetchIppOverviewLoading());
  const requestUrl = `cost-tracker/ipp-overview/${branchId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchIppOverviewSuccess(response.data.data));
    dispatch(fetchIppOverviewLoading(false))
  } catch (error) {
    dispatch(fetchIppOverviewLoading(false));
  }
};

export const getCostTrackerBaselineData = (branchId) => async (dispatch) => {
  dispatch(fetchCostTrackerBaselineLoading());
  const requestUrl = `cost-tracker/baseline/${branchId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchCostTrackerBaselineSuccess(response.data.data));
    dispatch(fetchCostTrackerBaselineLoading(false))
  } catch (error) {
    dispatch(fetchCostTrackerBaselineLoading(false));
  }
};

export const fetchFuelConsumptionDataOLd = (queryString) => async (dispatch) => {
  dispatch(fetchFuelDataLoading());
  const requestUrl = `fuel_entry?${queryString}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchFuelDataSuccess(response.data.data));
    dispatch(fetchFuelDataLoading(false))
    return {
      fullfilled: true,
      data: response.data
    }
  } catch (error) {
    dispatch(fetchFuelDataLoading(false));
  }
};

export const getBranchGeneratorsData = (branchId) => async (dispatch) => {
  dispatch(fetchGeneratorListsLoading());
  const requestUrl = `branch/${branchId}/generators/`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchGeneratorListsSuccess(response.data));
    dispatch(fetchGeneratorListsLoading(false))
    return {
      fullfilled: true,
      data: response.data
    }
  } catch (error) {
    dispatch(fetchGeneratorListsLoading(false));
  }
};

export const fetchFuelConsumptionData = (queryString) => async (dispatch) => {
  dispatch(fetchFuelDataLoading());
  const requestUrl = `diesel_tracker_overview/${queryString}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchFuelDataSuccess(response.data.data));
    dispatch(fetchFuelDataLoading(false))
    return {
      fullfilled: true,
      data: response.data.data
    }
  } catch (error) {
    dispatch(fetchFuelDataLoading(false));
  }
};

export const fetchDieselDailyUsageData = () => async (dispatch) => {
  dispatch(fetchDieselDailyUsageLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
    let branchId;
    if (loggedUserJSON) {
      const userToken = JSON.parse(loggedUserJSON);
      const user = jwtDecode(userToken.access)
      branchId = user.branch_id;
  }
  const requestUrl = `cost-tracker/diesel-daily-usage/${branchId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchDieselDailyUsageSuccess(response.data.data));
    dispatch(fetchDieselDailyUsageLoading(false))
    return {
      fullfilled: true,
      data: response.data.data
    }
  } catch (error) {
    dispatch(fetchDieselDailyUsageLoading(false));
  }
};

export const fetchDieselMonthlyUsageData = () => async (dispatch) => {
  dispatch(fetchDieselMonthlyUsageLoading());
  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let branchId;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    branchId = user.branch_id;
  }
  const requestUrl = `cost-tracker/diesel-monthly-usage/${branchId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchDieselMonthlyUsageSuccess(response.data.data));
    dispatch(fetchDieselMonthlyUsageLoading(false))
    return {
      fullfilled: true,
      data: response.data.data
    }
  } catch (error) {
    dispatch(fetchDieselMonthlyUsageLoading(false));
  }
};

export const addFuelConsumptionData = (branchId, parameters) => async (dispatch) => {
  dispatch(addFuelDataLoading());
  const requestUrl = `fuel-entry/${branchId}/`;
  try {
    const response = await APIService.post(requestUrl, parameters);
    dispatch(addFuelDataSuccess(response.data.data));
    dispatch(addFuelDataLoading(false))
    return { fullfilled: true, message: response }
  } catch (error) {
    dispatch(addFuelDataLoading(false));
    return { fullfilled: false, message: error }
  }
};

export const addMonthlyFuelConsumptionData = (branchId, parameters) => async (dispatch) => {
  dispatch(addMonthlyFuelDataLoading());
  const requestUrl = `monthly-fuel-entry/${branchId}/`;
  try {
    const response = await APIService.post(requestUrl, parameters);
    dispatch(addMonthlyFuelDataSuccess(response.data.data));
    dispatch(addMonthlyFuelDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(addMonthlyFuelDataLoading(false));
    return { fullfilled: false, message: error?.response?.data }
  }
};

export const updateFuelConsumptionData = (id, parameters) => async (dispatch) => {
  dispatch(editFuelDataLoading());
  const requestUrl = `fuel-entry/${id}/`;
  try {
    const response = await APIService.patch(requestUrl, parameters);
    dispatch(editFuelDataSuccess(response.data.data));
    dispatch(editFuelDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(editFuelDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};

export const deleteFuelConsumptionData = (id, parameters) => async (dispatch) => {
  dispatch(deleteFuelDataLoading());
  const requestUrl = `delete-fuel-entry/${id}/`;
  try {
    const response = await APIService.delete(requestUrl, parameters);
    dispatch(deleteFuelDataSuccess(response.data.data));
    dispatch(deleteFuelDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(deleteFuelDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};

export const updateFuelPurchaseData = (userId, parameters) => async (dispatch) => {
  dispatch(editFuelPUrchaseDataLoading());
  const requestUrl = `cost_tracker/${userId}/add_cost/diesel/`;
  try {
    const response = await APIService.put(requestUrl, parameters);
    dispatch(editFuelPUrchaseDataSuccess(response.data.data));
    dispatch(editFuelPUrchaseDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(editFuelPUrchaseDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};

export const deleteFuelPurchaseData = (userId, parameters) => async (dispatch) => {
  dispatch(deleteFuelPUrchaseDataLoading());
  const requestUrl = `cost_tracker/${userId}/add_cost/diesel/`;
  try {
    const response = await APIService.delete(requestUrl, parameters);
    dispatch(deleteFuelPUrchaseDataSuccess(response.data.data));
    dispatch(deleteFuelPUrchaseDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(deleteFuelPUrchaseDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};

export const updatePrepaidUtilityPaymentData = (userId, parameters) => async (dispatch) => {
  dispatch(editPreUtilityPurchaseDataLoading());
  const requestUrl = `cost_tracker/${userId}/add_cost/pre-paid/`;
  try {
    const response = await APIService.put(requestUrl, parameters);
    dispatch(editPreUtilityPurchaseDataSuccess(response.data.data));
    dispatch(editPreUtilityPurchaseDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(editPreUtilityPurchaseDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};

export const deletePrepaidUtilityPaymentData = (userId, parameters) => async (dispatch) => {
  dispatch(deletePreUtilityPurchaseDataLoading());
  const requestUrl = `cost_tracker/${userId}/add_cost/pre-paid/`;
  try {
    const response = await APIService.delete(requestUrl, parameters);
    dispatch(deletePreUtilityPurchaseDataSuccess(response.data.data));
    dispatch(deletePreUtilityPurchaseDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(deletePreUtilityPurchaseDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};

export const updateIppPaymentData = (userId, parameters) => async (dispatch) => {
  dispatch(editIppPurchaseDataLoading());
  const requestUrl = `cost_tracker/${userId}/add_cost/ipp/`;
  try {
    const response = await APIService.put(requestUrl, parameters);
    dispatch(editIppPurchaseDataSuccess(response.data.data));
    dispatch(editIppPurchaseDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(editIppPurchaseDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};

export const deleteIppPaymentData = (userId, parameters) => async (dispatch) => {
  dispatch(deleteIppPurchaseDataLoading());
  const requestUrl = `cost_tracker/${userId}/add_cost/pre-paid/`;
  try {
    const response = await APIService.delete(requestUrl, parameters);
    dispatch(deleteIppPurchaseDataSuccess(response.data.data));
    dispatch(deleteIppPurchaseDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(deleteIppPurchaseDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};

export const updatePostpaidUtilityPaymentData = (userId, parameters) => async (dispatch) => {
  dispatch(editPostUtilityPurchaseDataLoading());
  const requestUrl = `cost_tracker/${userId}/add_cost/post-paid/`;
  try {
    const response = await APIService.put(requestUrl, parameters);
    dispatch(editPostUtilityPurchaseDataSuccess(response.data.data));
    dispatch(editPostUtilityPurchaseDataLoading(false))
    return { fullfilled: true, message: response.data.detail }
  } catch (error) {
    dispatch(editPostUtilityPurchaseDataLoading(false));
    return { fullfilled: false, message: error.response.detail }
  }
};