
// const dashBoardType 

import costTrackerType from "../../reducers/costTracker/costTracker.types";

export const fetchCostTrackerLoading = (payload = true) => ({
  type: costTrackerType.FETCH_COSTTRACKER_LOADING,
  payload,
});
export const fetchCostTrackerSuccess = payload => ({
  type: costTrackerType.FETCH_COSTTRACKER_SUCCESS,
  payload,
});


export const fetchFuelDataLoading = (payload = true) => ({
  type: costTrackerType.FETCH_FUEL_CONSUMPTION_DATA_LOADING,
  payload,
});
export const fetchFuelDataSuccess = payload => ({
  type: costTrackerType.FETCH_FUEL_CONSUMPTION_DATA_SUCCESS,
  payload,
});

export const fetchGeneratorListsLoading = (payload = true) => ({
  type: costTrackerType.FETCH_GENERATOR_LISTS_LOADING,
  payload,
});
export const fetchGeneratorListsSuccess = payload => ({
  type: costTrackerType.FETCH_GENERATOR_LISTS_SUCCESS,
  payload,
});

export const addFuelDataLoading = (payload = true) => ({
  type: costTrackerType.ADD_FUEL_CONSUMPTION_DATA_LOADING,
  payload,
});
export const addFuelDataSuccess = payload => ({
  type: costTrackerType.ADD_FUEL_CONSUMPTION_DATA_SUCCESS,
  payload,
});

export const addMonthlyFuelDataLoading = (payload = true) => ({
  type: costTrackerType.ADD_MONTHLY_FUEL_CONSUMPTION_DATA_LOADING,
  payload,
});
export const addMonthlyFuelDataSuccess = payload => ({
  type: costTrackerType.ADD_MONTHLY_FUEL_CONSUMPTION_DATA_SUCCESS,
  payload,
});

export const editFuelDataLoading = (payload = true) => ({
  type: costTrackerType.EDIT_FUEL_CONSUMPTION_DATA_LOADING,
  payload,
});
export const editFuelDataSuccess = payload => ({
  type: costTrackerType.EDIT_FUEL_CONSUMPTION_DATA_SUCCESS,
  payload,
});

export const deleteFuelDataLoading = (payload = true) => ({
  type: costTrackerType.DELETE_FUEL_CONSUMPTION_DATA_LOADING,
  payload,
});
export const deleteFuelDataSuccess = payload => ({
  type: costTrackerType.DELETE_FUEL_CONSUMPTION_DATA_SUCCESS,
  payload,
});

export const editFuelPUrchaseDataLoading = (payload = true) => ({
  type: costTrackerType.EDIT_FUEL_PURCHASE_DATA_LOADING,
  payload,
});
export const editFuelPUrchaseDataSuccess = payload => ({
  type: costTrackerType.EDIT_FUEL_PURCHASE_DATA_SUCCESS,
  payload,
});

export const deleteFuelPUrchaseDataLoading = (payload = true) => ({
  type: costTrackerType.DELETE_FUEL_PURCHASE_DATA_LOADING,
  payload,
});
export const deleteFuelPUrchaseDataSuccess = payload => ({
  type: costTrackerType.DELETE_FUEL_PURCHASE_DATA_SUCCESS,
  payload,
});

export const editPreUtilityPurchaseDataLoading = (payload = true) => ({
  type: costTrackerType.EDIT_PRE_UTILITY_PURCHASE_DATA_LOADING,
  payload,
});
export const editPreUtilityPurchaseDataSuccess = payload => ({
  type: costTrackerType.EDIT_PRE_UTILITY_PURCHASE_DATA_SUCCESS,
  payload,
});

export const deletePreUtilityPurchaseDataLoading = (payload = true) => ({
  type: costTrackerType.DELETE_PRE_UTILITY_PURCHASE_DATA_LOADING,
  payload,
});
export const deletePreUtilityPurchaseDataSuccess = payload => ({
  type: costTrackerType.DELETE_PRE_UTILITY_PURCHASE_DATA_SUCCESS,
  payload,
});

export const editIppPurchaseDataLoading = (payload = true) => ({
  type: costTrackerType.EDIT_IPP_PURCHASE_DATA_LOADING,
  payload,
});
export const editIppPurchaseDataSuccess = payload => ({
  type: costTrackerType.EDIT_IPP_PURCHASE_DATA_SUCCESS,
  payload,
});

export const deleteIppPurchaseDataLoading = (payload = true) => ({
  type: costTrackerType.DELETE_IPP_PURCHASE_DATA_LOADING,
  payload,
});
export const deleteIppPurchaseDataSuccess = payload => ({
  type: costTrackerType.DELETE_IPP_PURCHASE_DATA_SUCCESS,
  payload,
});

export const editPostUtilityPurchaseDataLoading = (payload = true) => ({
  type: costTrackerType.EDIT_POST_UTILITY_PURCHASE_DATA_LOADING,
  payload,
});
export const editPostUtilityPurchaseDataSuccess = payload => ({
  type: costTrackerType.EDIT_POST_UTILITY_PURCHASE_DATA_SUCCESS,
  payload,
});
