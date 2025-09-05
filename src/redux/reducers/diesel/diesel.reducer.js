import dieselType from './diesel.types';

const INITIAL_STATE = {
  branchGeneratorsStatusLoading: false,
  branchGeneratorsStatusData: false,

  branchGeneratorMonthlyEnergyLoading: false,
  branchGeneratorMonthlyEnergyData: false,

  dieselPriceLoading: false,
  dieselPriceData: false,
};

const dieselReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case dieselType.FETCH_GENERATORS_STATUS_LOADING:
      return {
        ...state,
        branchGeneratorsStatusLoading: action.payload,
      };
    case dieselType.FETCH_GENERATORS_STATUS_SUCCESS:
      return {
        ...state,
        branchGeneratorsStatusData: action.payload,
      };

    case dieselType.FETCH_GENERATOR_MONTHLY_ENERGY_LOADING:
      return {
        ...state,
        branchGeneratorMonthlyEnergyLoading: action.payload,
      };
    case dieselType.FETCH_GENERATOR_MONTHLY_ENERGY_SUCCESS:
      return {
        ...state,
        branchGeneratorMonthlyEnergyData: action.payload,
      };

    case dieselType.FETCH_DIESEL_PRICE_LOADING:
      return {
        ...state,
        dieselPriceLoading: action.payload,
      };
    case dieselType.FETCH_DIESEL_PRICE_SUCCESS:
      return {
        ...state,
        dieselPriceData: action.payload,
      };

    default: return state;
  }
};

export default dieselReducer;