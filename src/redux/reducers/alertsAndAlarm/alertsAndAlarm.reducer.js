import alertsAndAlarmTypes from './alertsAndAlarm.types';

const INITIAL_STATE = {
   fetchAlertsDataLoading: false,
   alertsData: false,
   setAlertsDataLoading: false,
   generatedAlertsData: false,
};

const alertsAndAlarmReducer = (state = INITIAL_STATE, action) => {

   switch (action.type) {

      case alertsAndAlarmTypes.GET_ALERTS_AND_ALARM_LOADING:
         return {
            ...state,
            fetchAlertsDataLoading: action.payload,
         };
      case alertsAndAlarmTypes.GET_ALERTS_AND_ALARM_SUCCESS:
         return {
            ...state,
            alertsData: action.payload,
         };

      case alertsAndAlarmTypes.SET_ALERTS_AND_ALARM_LOADING:
         return {
            ...state,
            setAlertsDataLoading: action.payload,
         };
      case alertsAndAlarmTypes.SET_ALERTS_AND_ALARM_SUCCESS:
         return {
            ...state,
            generatedAlertsData: action.payload,
         };

      default: return state;

   }

};

export default alertsAndAlarmReducer;