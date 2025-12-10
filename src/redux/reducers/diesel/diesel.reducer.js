import dieselType from './diesel.types';

const INITIAL_STATE = {
  branchGeneratorsStatusLoading: false,
  branchGeneratorsStatusData: false,

  dieselPriceLoading: false,
  dieselPriceData: false,

  co2EmissionLoading: false,
  co2EmissionData: false,

  branchGeneratorMonthlyEnergyLoading: false,
  branchGeneratorMonthlyEnergyData: false,

  genStatusChartLoading: false,
  genStatusChartData: false,

  genFuelUsageLoading: false,
  genFuelUsageData: false,

  fuelUsageLoading: false,
  fuelUsageData: false,

  operationalEfficiencyLoading: false,
  operationalEfficiencyData: false,

  costAnalysisLoading: false,
  costAnalysisData: false,
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

    case dieselType.FETCH_CO2_EMISSION_LOADING:
      return {
        ...state,
        co2EmissionLoading: action.payload,
      };
    case dieselType.FETCH_CO2_EMISSION_SUCCESS:
      return {
        ...state,
        co2EmissionData: action.payload,
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

    case dieselType.FETCH_GEN_STATUS_CHART_LOADING:
      return {
        ...state,
        genStatusChartLoading: action.payload,
      };
    case dieselType.FETCH_GEN_STATUS_CHART_SUCCESS:
      return {
        ...state,
        genStatusChartData: action.payload,
      };

    case dieselType.FETCH_GEN_FUEL_USAGE_LOADING:
      return {
        ...state,
        genFuelUsageLoading: action.payload,
      };
    case dieselType.FETCH_GEN_FUEL_USAGE_SUCCESS:
      return {
        ...state,
        genFuelUsageData: action.payload,
      };

    case dieselType.FETCH_FUEL_USAGE_LOADING:
      return {
        ...state,
        fuelUsageLoading: action.payload,
      };
    case dieselType.FETCH_FUEL_USAGE_SUCCESS:
      return {
        ...state,
        fuelUsageData: action.payload,
      };

    case dieselType.FETCH_OPERATIONAL_EFFICIENCY_LOADING:
      return {
        ...state,
        operationalEfficiencyLoading: action.payload,
      };
    case dieselType.FETCH_OPERATIONAL_EFFICIENCY_SUCCESS:
      return {
        ...state,
        operationalEfficiencyData: action.payload,
      };

    case dieselType.FETCH_COST_ANALYSIS_LOADING:
      return {
        ...state,
        costAnalysisLoading: action.payload,
      };
    case dieselType.FETCH_COST_ANALYSIS_SUCCESS:
      return {
        ...state,
        costAnalysisData: action.payload,
      };

    default: return state;
  }
};

export default dieselReducer;