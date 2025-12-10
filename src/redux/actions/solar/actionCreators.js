import solarType from "../../reducers/solar/solar,types";

export const getWeatherReadingsLoading = (payload = true) => ({
  type: solarType.FETCH_WEATHER_READINGS_LOADING,
  payload,
});
export const getWeatherReadingsSuccess = payload => ({
  type: solarType.FETCH_WEATHER_READINGS_SUCCESS,
  payload,
});

export const getComponentsTableLoading = (payload = true) => ({
  type: solarType.FETCH_COMPONENTS_TABLE_LOADING,
  payload,
});
export const getComponentsTableSuccess = payload => ({
  type: solarType.FETCH_COMPONENTS_TABLE_SUCCESS,
  payload,
});

export const getInverterGridsLoading = (payload = true) => ({
  type: solarType.FETCH_INVERTER_GRIDS_LOADING,
  payload,
});
export const getInverterGridsSuccess = payload => ({
  type: solarType.FETCH_INVERTER_GRIDS_SUCCESS,
  payload,
});

export const getConsumptionChartLoading = (payload = true) => ({
  type: solarType.FETCH_CONSUMPTION_CHART_LOADING,
  payload,
});
export const getConsumptionChartSuccess = payload => ({
  type: solarType.FETCH_CONSUMPTION_CHART_SUCCESS,
  payload,
});

export const getPvProductionChartLoading = (payload = true) => ({
  type: solarType.FETCH_PV_PRODUCTION_CHART_LOADING,
  payload,
});
export const getPvProductionChartSuccess = payload => ({
  type: solarType.FETCH_PV_PRODUCTION_CHART_SUCCESS,
  payload,
});

export const getBatteryChartLoading = (payload = true) => ({
  type: solarType.FETCH_BATTERY_CHART_LOADING,
  payload,
});
export const getBatteryChartSuccess = payload => ({
  type: solarType.FETCH_BATTERY_CHART_SUCCESS,
  payload,
});