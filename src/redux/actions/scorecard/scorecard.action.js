
import axios from "axios";
import EnvData from "../../../config/EnvData";
import {
  fetchScoreCardLoading,
  fetchScoreCardSuccess,
  getBaselineEnergyLoading,
  getBaselineEnergySuccess,
  getFuelConsumptionLoading,
  getFuelConsumptionSuccess,
  getGeneratorFuelEfficiencyLoading,
  getGeneratorFuelEfficiencySuccess,
  getGeneratorSizeEfficiencyLoading,
  getGeneratorSizeEfficiencySuccess,
  getOperatingTimeDeviationLoading,
  getOperatingTimeDeviationSuccess,
  getPAPRLoading,
  getPAPRSuccess,
  getScorecardCarbonEmissionLoading,
  getScorecardCarbonEmissionSuccess
} from "./actionCreators";
import dataHttpServices from '../../../services/devices';
import moment from 'moment';
import jwtDecode from "jwt-decode";


export const fetchScoreCardData = (userDateRange) => async (dispatch) => {
  dispatch(fetchScoreCardLoading());

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
      `${EnvData.REACT_APP_API_URL}scorecard/${branchId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchScoreCardSuccess(response.data.authenticatedData));
    dispatch(fetchScoreCardLoading(false))
  } catch (error) {
    dispatch(fetchScoreCardLoading(false));
  }
};

export const fetchBaselineEnergyData = (userDateRange) => async (dispatch) => {
  dispatch(getBaselineEnergyLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  let branchId;
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
      `${EnvData.REACT_APP_API_URL}scorecard/baseline-energy/${branchId}/${dateToUse}/`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(getBaselineEnergySuccess(response.data.authenticatedData));
    dispatch(getBaselineEnergyLoading(false))
  } catch (error) {
    dispatch(getBaselineEnergyLoading(false));
  }
};

export const fetchPAPRData = (userDateRange) => async (dispatch) => {
  dispatch(getPAPRLoading());

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
      `${EnvData.REACT_APP_API_URL}scorecard/peak-to-avg-power-ratio/${branchId}/${dateToUse}/`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(getPAPRSuccess(response.data.authenticatedData));
    dispatch(getPAPRLoading(false))
  } catch (error) {
    dispatch(getPAPRLoading(false));
  }
};

export const fetchScorecardCarbonEmissionData = (userDateRange) => async (dispatch) => {
  dispatch(getScorecardCarbonEmissionLoading());

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
      `${EnvData.REACT_APP_API_URL}scorecard/carbon-emissions/${branchId}/${dateToUse}/`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    console.log('Carbon Emission Data:',  response.data.authenticatedData);
    
    dispatch(getScorecardCarbonEmissionSuccess(response.data.authenticatedData));
    dispatch(getScorecardCarbonEmissionLoading(false))
  } catch (error) {
    dispatch(getScorecardCarbonEmissionLoading(false));
  }
};

export const fetchGeneratorSizeEfficiencyData = (userDateRange) => async (dispatch) => {
  dispatch(getGeneratorSizeEfficiencyLoading());

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
      `${EnvData.REACT_APP_API_URL}scorecard/generator-size-efficiency/${branchId}/${dateToUse}/`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(getGeneratorSizeEfficiencySuccess(response.data.authenticatedData));
    dispatch(getGeneratorSizeEfficiencyLoading(false))
  } catch (error) {
    dispatch(getGeneratorSizeEfficiencyLoading(false));
  }
};

export const fetchGeneratorFuelEfficiencyData = (userDateRange) => async (dispatch) => {
  dispatch(getGeneratorFuelEfficiencyLoading());

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
      `${EnvData.REACT_APP_API_URL}scorecard/fuel-consumption/${branchId}/${dateToUse}/`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(getGeneratorFuelEfficiencySuccess(response.data.authenticatedData));
    dispatch(getGeneratorFuelEfficiencyLoading(false))
  } catch (error) {
    dispatch(getGeneratorFuelEfficiencyLoading(false));
  }
};

export const fetchScorecardOperatingTimeData = (userDateRange) => async (dispatch) => {
  dispatch(getOperatingTimeDeviationLoading());

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
      `${EnvData.REACT_APP_API_URL}scorecard/operating-time/${branchId}/${dateToUse}/`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(getOperatingTimeDeviationSuccess(response.data.authenticatedData));
    dispatch(getOperatingTimeDeviationLoading(false))
  } catch (error) {
    dispatch(getOperatingTimeDeviationLoading(false));
  }
};