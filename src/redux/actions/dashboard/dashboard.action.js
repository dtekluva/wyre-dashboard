
import axios from "axios";
import EnvData from "../../../config/EnvData";
import {
  fetchDashBoardLoading, fetchDemandSuccess,
  fetchDashBoardSuccess, fetchDemandLoading, fetchBlendedCostEnergyLoading, fetchBlendedCostEnergySuccess,
  fetchDashBoardCard_1_Loading,
  fetchDashBoardCard_1_Success,
  fetchDashBoardCard_2_Loading,
  fetchDashBoardCard_2_Success,
  fetchDashBoardCard_3_Loading,
  fetchDashBoardCard_3_Success,
  fetchLoadOverview_Loading,
  fetchLoadOverview_Success
} from "./actionCreators";
import dataHttpServices from '../../../services/devices';
import moment from 'moment';
import jwtDecode from "jwt-decode";
import { APIService } from "../../../config/api/apiConfig";


export const fetchDashBoardData = (userDateRange) => async (dispatch) => {
  dispatch(fetchDashBoardLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}dashboard_data/${userId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchDashBoardSuccess(response.data.authenticatedData));
    dispatch(fetchDashBoardLoading(false))
  } catch (error) {
    dispatch(fetchDashBoardLoading(error));
  }
};

export const fetchDashBoardDataCard_1 = (userDateRange) => async (dispatch) => {
  dispatch(fetchDashBoardCard_1_Loading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  const requestUrl = `dashboard/total_energy/${branchId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchDashBoardCard_1_Success(response.data.authenticatedData));
    dispatch(fetchDashBoardCard_1_Loading(false))
  } catch (error) {
    dispatch(fetchDashBoardCard_1_Loading(false));
  }
};

export const fetchDashBoardDataCard_2 = (userDateRange) => async (dispatch) => {
  dispatch(fetchDashBoardCard_2_Loading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  const requestUrl = `dashboard/device_usage/${branchId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchDashBoardCard_2_Success(response.data.authenticatedData));
    dispatch(fetchDashBoardCard_2_Loading(false))
  } catch (error) {
    dispatch(fetchDashBoardCard_2_Loading(false));
  }
};

export const fetchDashBoardDataCard_3 = (userDateRange) => async (dispatch) => {
  dispatch(fetchDashBoardCard_3_Loading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  const requestUrl = `dashboard/daily_consumption/${branchId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchDashBoardCard_3_Success(response.data.authenticatedData));
    dispatch(fetchDashBoardCard_3_Loading(false))
  } catch (error) {
    dispatch(fetchDashBoardCard_3_Loading(false));
  }
};

export const fetchLoadOverviewData = (userDateRange) => async (dispatch) => {
  dispatch(fetchLoadOverview_Loading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  const requestUrl = `dashboard/load_overview/${branchId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchLoadOverview_Success(response.data.authenticatedData));
    dispatch(fetchLoadOverview_Loading(false))
  } catch (error) {
    dispatch(fetchLoadOverview_Loading(false));
  }
};

export const fetchBlendedCostData = (branch_id, userDateRange) => async (dispatch) => {
  dispatch(fetchBlendedCostEnergyLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    // userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}blended_cost/${branchId}/${dateToUse}/`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchBlendedCostEnergySuccess(response.data.data));
    dispatch(fetchBlendedCostEnergyLoading(false))
  } catch (error) {
    dispatch(fetchBlendedCostEnergyLoading(error));
  }
};

export const fetchPAPR = (userDateRange) => async (dispatch) => {
  dispatch(fetchDemandLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  const requestUrl = `branch_demand/${branchId}/${dateToUse}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchDemandSuccess(response.data.data));
    dispatch(fetchDemandLoading(false))
  } catch (error) {
    dispatch(fetchDemandLoading(false));
  }
};