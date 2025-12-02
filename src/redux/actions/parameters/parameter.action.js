
import axios from "axios";
import EnvData from "../../../config/EnvData";
import {fetchEnergyConsumptionLoading, fetchEnergyConsumptionSuccess, fetchLastReadingLoading, fetchLastReadingSuccess, fetchPowerDemandLoading, fetchPowerDemandSuccess, fetchPowerQualityLoading, fetchPowerQualitySuccess} from "./actionCreators";
import dataHttpServices from '../../../services/devices';
import moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { APIService } from "../../../config/api/apiConfig";

export const fetchEnergyConsumptionData = (userDateRange) => async (dispatch) => {
  dispatch(fetchEnergyConsumptionLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
    branchId = user.branch_id;
  }
  const requestUrl = `dashboard/energy_consumption/${branchId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchEnergyConsumptionSuccess(response.data.authenticatedData));
    dispatch(fetchEnergyConsumptionLoading(false))
  } catch (error) {
    dispatch(fetchEnergyConsumptionLoading(false));
  }
};

export const fetchPowerQualityData = (userDateRange) => async (dispatch) => {
  dispatch(fetchPowerQualityLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
    branchId = user.branch_id;
  }
  const requestUrl = `dashboard/power_quality/${branchId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchPowerQualitySuccess(response.data));
    dispatch(fetchPowerQualityLoading(false))
  } catch (error) {
    dispatch(fetchPowerQualityLoading(false));
  }
};

export const fetchPowerDemandData = (userDateRange) => async (dispatch) => {
  dispatch(fetchPowerDemandLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
    branchId = user.branch_id;
  }
  const requestUrl = `dashboard/power_demand/${branchId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchPowerDemandSuccess(response.data));
    dispatch(fetchPowerDemandLoading(false))
  } catch (error) {
    dispatch(fetchPowerDemandLoading(false));
  }
};

export const fetchLastReadingData = (userDate) => async (dispatch) => {
  dispatch(fetchLastReadingLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  const singleDateToUse = userDate && userDate.length > 0 && `${moment(userDate[0]).format('DD-MM-YYYY HH:mm')}`
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  const requestUrl = `dashboard/last_reading/${branchId}/${singleDateToUse}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchLastReadingSuccess(response.data.authenticatedData));
    dispatch(fetchLastReadingLoading(false))
  } catch (error) {
    dispatch(fetchLastReadingLoading(false));
  }
};