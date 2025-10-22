import { getAlertsAndAlarmLoading, getAlertsAndAlarmSuccess, setAlertsAndAlarmLoading, setAlertsAndAlarmSuccess } from './actionCreators';
import { APIService } from '../../../config/api/apiConfig';
import jwtDecode from "jwt-decode";

export const getAlertAndAlarm = () => async (dispatch) => {
  dispatch(getAlertsAndAlarmLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  const requestUrl = `alerts_data/${branchId}`;
  try {
    const response = await APIService.get(requestUrl);
    dispatch(getAlertsAndAlarmSuccess(response.data));
    dispatch(getAlertsAndAlarmLoading(false))
  } catch (error) {
    dispatch(getAlertsAndAlarmLoading(false));
  }
};

export const setAlertAndAlarm = () => async (dispatch) => {
  dispatch(setAlertsAndAlarmLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let branchId;
  let token;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    branchId = user.branch_id;
    token = userToken.access;
  }
  const requestUrl = `alerts_data/${branchId}/`;
  try {
    const response = await APIService.post(requestUrl);
    dispatch(setAlertsAndAlarmSuccess(response.data));
    dispatch(setAlertsAndAlarmLoading(false))
  } catch (error) {
    dispatch(setAlertsAndAlarmLoading(false));
  }
};