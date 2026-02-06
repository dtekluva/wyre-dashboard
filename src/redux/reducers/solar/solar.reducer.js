import solarType from './solar,types';

const INITIAL_STATE = {
  weatherReadingsLoading: false,
  weatherReadingsData: false,

  componentsTableLoading: false,
  componentsTableData: false,

  inverterGridsLoading: false,
  inverterGridsData: false,

  consumptionChartLoading: false,
  consumptionChartData: false,

  pvProductionChartLoading: false,
  pvProductionChartData: false,

  batteryChartLoading: false,
  batteryChartData: false,
};

const solarReducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case solarType.FETCH_WEATHER_READINGS_LOADING:
      return {
        ...state,
        weatherReadingsLoading: action.payload,
      };
    case solarType.FETCH_WEATHER_READINGS_SUCCESS:
      return {
        ...state,
        weatherReadingsData: action.payload,
      };
      
    case solarType.FETCH_COMPONENTS_TABLE_LOADING:
      return {
        ...state,
        componentsTableLoading: action.payload,
      };
    case solarType.FETCH_COMPONENTS_TABLE_SUCCESS:
      return {
        ...state,
        componentsTableData: action.payload,
      };

    case solarType.FETCH_INVERTER_GRIDS_LOADING:
      return {
        ...state,
        inverterGridsLoading: action.payload,
      };
    case solarType.FETCH_INVERTER_GRIDS_SUCCESS:
      return {
        ...state,
        inverterGridsData: action.payload,
      };

    case solarType.FETCH_CONSUMPTION_CHART_LOADING:
      return {
        ...state,
        consumptionChartLoading: action.payload,
      };
    case solarType.FETCH_CONSUMPTION_CHART_SUCCESS:
      return {
        ...state,
        consumptionChartData: action.payload,
      };

    case solarType.FETCH_PV_PRODUCTION_CHART_LOADING:
      return {
        ...state,
        pvProductionChartLoading: action.payload,
      };
    case solarType.FETCH_PV_PRODUCTION_CHART_SUCCESS:
      return {
        ...state,
        pvProductionChartData: action.payload,
      };

    case solarType.FETCH_BATTERY_CHART_LOADING:
      return {
        ...state,
        batteryChartLoading: action.payload,
      };
    case solarType.FETCH_BATTERY_CHART_SUCCESS:
      return {
        ...state,
        batteryChartData: action.payload,
      };

    default: return state;
  }
};

export default solarReducer;