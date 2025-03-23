
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


export const fetchDashBoardData = (userDateRange) => async (dispatch) => {
  dispatch(fetchDashBoardLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
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
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}dashboard/total_energy/${userId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchDashBoardCard_1_Success(response.data.authenticatedData));
    dispatch(fetchDashBoardCard_1_Loading(false))
  } catch (error) {
    dispatch(fetchDashBoardCard_1_Loading(error));
  }
};

export const fetchDashBoardDataCard_2 = (userDateRange) => async (dispatch) => {
  dispatch(fetchDashBoardCard_2_Loading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}dashboard/device_usage/${userId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchDashBoardCard_2_Success(response.data.authenticatedData));
    dispatch(fetchDashBoardCard_2_Loading(false))
  } catch (error) {
    dispatch(fetchDashBoardCard_2_Loading(error));
  }
};

export const fetchDashBoardDataCard_3 = (userDateRange) => async (dispatch) => {
  dispatch(fetchDashBoardCard_3_Loading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}dashboard/daily_consumption/${userId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchDashBoardCard_3_Success(response.data.authenticatedData));
    dispatch(fetchDashBoardCard_3_Loading(false))
  } catch (error) {
    dispatch(fetchDashBoardCard_3_Loading(error));
  }
};

export const fetchLoadOverviewData = (userDateRange) => async (dispatch) => {
  dispatch(fetchLoadOverview_Loading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}dashboard/load_overview/${userId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchLoadOverview_Success(response.data.authenticatedData));
    dispatch(fetchLoadOverview_Loading(false))
  } catch (error) {
    dispatch(fetchLoadOverview_Loading(error));
  }
};

export const fetchBlendedCostData = (branch_id, userDateRange) => async (dispatch) => {
  dispatch(fetchBlendedCostEnergyLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}blended_cost/${branch_id}/${dateToUse}/`, {
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
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}branch_demand/${userId}/${dateToUse}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchDemandSuccess(response.data.data));
    dispatch(fetchDemandLoading(false))
  } catch (error) {
    dispatch(fetchDemandLoading(error));
  }
};