import parametersType from './parameters.types';

const INITIAL_STATE = {
   getEnergyConsumptionLoading: false,
   fetchedEnergyConsumption: false,
   getPowerQualityLoading: false,
   fetchedPowerQuality: false,
   getPowerDemandLoading: false,
   fetchedPowerDemand: false,
   getLastReadingLoading: false,
   fetchedLastReading: false,
};

const parametersReducer = (state = INITIAL_STATE, action) => {

   switch (action.type) {
      case parametersType.FETCH_ENERGY_CONSUMPTION_LOADING:
         return {
            ...state,
            getEnergyConsumptionLoading: action.payload,
         };
      case parametersType.FETCH_ENERGY_CONSUMPTION_SUCCESS:
         return {
            ...state,
            fetchedEnergyConsumption: action.payload,
         };
         
      case parametersType.FETCH_POWER_QUALITY_LOADING:
         return {
            ...state,
            getPowerQualityLoading: action.payload,
         };
      case parametersType.FETCH_POWER_QUALITY_SUCCESS:
         return {
            ...state,
            fetchedPowerQuality: action.payload,
         };

      case parametersType.FETCH_POWER_DEMAND_LOADING:
         return {
            ...state,
            getPowerDemandLoading: action.payload,
         };
      case parametersType.FETCH_POWER_DEMAND_SUCCESS:
         return {
            ...state,
            fetchedPowerDemand: action.payload,
         };

      case parametersType.FETCH_LAST_READING_LOADING:
         return {
            ...state,
            getLastReadingLoading: action.payload,
         };
      case parametersType.FETCH_LAST_READING_SUCCESS:
         return {
            ...state,
            fetchedLastReading: action.payload,
         };

      default: return state;
    }
};

export default parametersReducer;