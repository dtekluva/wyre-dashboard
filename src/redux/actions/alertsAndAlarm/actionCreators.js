import alertsAndAlarmTypes from "../../reducers/alertsAndAlarm/alertsAndAlarm.types";

export const getAlertsAndAlarmLoading = (payload = true) => ({
    type: alertsAndAlarmTypes.GET_ALERTS_AND_ALARM_LOADING,
    payload,
  });
export const getAlertsAndAlarmSuccess = payload => ({
    type: alertsAndAlarmTypes.GET_ALERTS_AND_ALARM_SUCCESS,
    payload,
  });

export const setAlertsAndAlarmLoading = (payload = true) => ({
    type: alertsAndAlarmTypes.SET_ALERTS_AND_ALARM_LOADING,
    payload,
  });
export const setAlertsAndAlarmSuccess = payload => ({
    type: alertsAndAlarmTypes.SET_ALERTS_AND_ALARM_SUCCESS,
    payload,
  });