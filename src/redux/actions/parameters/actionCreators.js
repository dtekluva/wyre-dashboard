import parametersType from "../../reducers/parameters/parameters.types";

export const fetchEnergyConsumptionLoading = (payload = true) => ({
    type: parametersType.FETCH_ENERGY_CONSUMPTION_LOADING,
    payload,
});
export const fetchEnergyConsumptionSuccess = payload => ({
    type: parametersType.FETCH_ENERGY_CONSUMPTION_SUCCESS,
    payload,
});

export const fetchPowerQualityLoading = (payload = true) => ({
    type: parametersType.FETCH_POWER_QUALITY_LOADING,
    payload,
});
export const fetchPowerQualitySuccess = payload => ({
    type: parametersType.FETCH_POWER_QUALITY_SUCCESS,
    payload,
});

export const fetchPowerDemandLoading = (payload = true) => ({
    type: parametersType.FETCH_POWER_DEMAND_LOADING,
    payload,
});  
export const fetchPowerDemandSuccess = payload => ({
    type: parametersType.FETCH_POWER_DEMAND_SUCCESS,
    payload,
});

export const fetchLastReadingLoading = (payload = true) => ({
    type: parametersType.FETCH_LAST_READING_LOADING,
    payload,
});  
export const fetchLastReadingSuccess = payload => ({
    type: parametersType.FETCH_LAST_READING_SUCCESS,
    payload,
});