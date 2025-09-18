import dieselType from "../../reducers/diesel/diesel.types";

export const getGeneratorsStatusLoading = (payload = true) => ({
  type: dieselType.FETCH_GENERATORS_STATUS_LOADING,
  payload,
});
export const getGeneratorsStatusSuccess = payload => ({
  type: dieselType.FETCH_GENERATORS_STATUS_SUCCESS,
  payload,
});

export const getDieselPriceLoading = (payload = true) => ({
  type: dieselType.FETCH_DIESEL_PRICE_LOADING,
  payload,
});
export const getDieselPriceSuccess = payload => ({
  type: dieselType.FETCH_DIESEL_PRICE_SUCCESS,
  payload,
});

export const getCo2EmissionLoading = (payload = true) => ({
  type: dieselType.FETCH_CO2_EMISSION_LOADING,
  payload,
});
export const getCo2EmissionSuccess = payload => ({
  type: dieselType.FETCH_CO2_EMISSION_SUCCESS,
  payload,
});

export const getGeneratorMonthlyEnergyLoading = (payload = true) => ({
  type: dieselType.FETCH_GENERATOR_MONTHLY_ENERGY_LOADING,
  payload,
});
export const getGeneratorMonthlyEnergySuccess = payload => ({
  type: dieselType.FETCH_GENERATOR_MONTHLY_ENERGY_SUCCESS,
  payload,
});

export const getGenStatusChartLoading = (payload = true) => ({
  type: dieselType.FETCH_GEN_STATUS_CHART_LOADING,
  payload,
});
export const getGenStatusChartSuccess = payload => ({
  type: dieselType.FETCH_GEN_STATUS_CHART_SUCCESS,
  payload,
});

export const getGenFuelUsageLoading = (payload = true) => ({
  type: dieselType.FETCH_GEN_FUEL_USAGE_LOADING,
  payload,
});
export const getGenFuelUsageSuccess = payload => ({
  type: dieselType.FETCH_GEN_FUEL_USAGE_SUCCESS,
  payload,
});

export const getFuelUsageLoading = (payload = true) => ({
  type: dieselType.FETCH_FUEL_USAGE_LOADING,
  payload,
});
export const getFuelUsageSuccess = payload => ({
  type: dieselType.FETCH_FUEL_USAGE_SUCCESS,
  payload,
});

export const getOperationalEfficiencyLoading = (payload = true) => ({
  type: dieselType.FETCH_OPERATIONAL_EFFICIENCY_LOADING,
  payload,
});
export const getOperationalEfficiencySuccess = payload => ({
  type: dieselType.FETCH_OPERATIONAL_EFFICIENCY_SUCCESS,
  payload,
});

export const getCostAnalysisLoading = (payload = true) => ({
  type: dieselType.FETCH_COST_ANALYSIS_LOADING,
  payload,
});
export const getCostAnalysisSuccess = payload => ({
  type: dieselType.FETCH_COST_ANALYSIS_SUCCESS,
  payload,
});