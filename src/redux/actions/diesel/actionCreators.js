import dieselType from "../../reducers/diesel/diesel.types";

export const getGeneratorsStatusLoading = (payload = true) => ({
  type: dieselType.FETCH_GENERATORS_STATUS_LOADING,
  payload,
});
export const getGeneratorsStatusSuccess = payload => ({
  type: dieselType.FETCH_GENERATORS_STATUS_SUCCESS,
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

export const getDieselPriceLoading = (payload = true) => ({
  type: dieselType.FETCH_DIESEL_PRICE_LOADING,
  payload,
});
export const getDieselPriceSuccess = payload => ({
  type: dieselType.FETCH_DIESEL_PRICE_SUCCESS,
  payload,
});