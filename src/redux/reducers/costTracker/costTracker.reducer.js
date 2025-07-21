
import { fetchCostTrackerBaselineLoading, fetchCostTrackerOverviewLoading, fetchDieselOverviewLoading, fetchIppOverviewLoading, fetchUtilityOverviewLoading } from '../../actions/constTracker/actionCreators';
import costTrackerType from './costTracker.types';

const INITIAL_STATE = {
  fetchCostTrackerLoading: false,
  costTrackerData: false,

  fetchCostTrackerOverviewLoading: false,
  costTrackerOverviewData: false,
  
  fetchDieselOverviewLoading: false,
  dieselOverviewData: false,
  
  fetchUtilityOverviewLoading: false,
  utilityOverviewData: false,

  fetchIppOverviewLoading: false,
  ippOverviewData: false,
  
  fetchCostTrackerBaselineLoading: false,
  CostTrackerBaselineData: false,
  
  fuelConsumptionData: false,
  fuelConsumptionDataLoading: false,
  
  fetchedListOfGenerators: false,
  listOfGeneratorsLoading: false,

  addFuelConsumptiondata: false,
  addFuelConsumptionDataLoadin: false,

  addMonthlyFuelConsumptiondata: false,
  addMonthlyFuelConsumptionDataLoadin: false,

  editedFuelConsumptiondata: false,
  editFuelConsumptionDataLoadin: false,

  deletedFuelConsumptiondata: false,
  deleteFuelConsumptionDataLoadin: false,

  editedFuelPurchaseData: false,
  editFuelPurchaseDataLoadin: false,
  
  deletedFuelPurchaseData: false,
  deleteFuelPurchaseDataLoadin: false,
  
  editedPreUtilityPurchaseData: false,
  editPreUtilityPurchaseDataLoadin: false,

  deletedPreUtilityPurchaseData: false,
  deletePreUtilityPurchaseDataLoadin: false,

  editedIppPurchaseData: false,
  editIppPurchaseDataLoadin: false,

  deletedIppPurchaseData: false,
  deleteIppPurchaseDataLoadin: false,
  
  editedPostUtilityPurchaseData: false,
  editPostUtilityPurchaseDataLoadin: false,
};

const reducer = (state = INITIAL_STATE, action) => {

  switch (action.type) {

    case costTrackerType.FETCH_COSTTRACKER_LOADING:
      return {
        ...state,
        fetchCostTrackerLoading: action.payload,
      };
    case costTrackerType.FETCH_COSTTRACKER_SUCCESS:
      return {
        ...state,
        costTrackerData: action.payload,
      };
      
    case costTrackerType.FETCH_COSTTRACKER_OVERVIEW_LOADING:
      return {
        ...state,
        fetchCostTrackerOverviewLoading: action.payload,
      };
    case costTrackerType.FETCH_COSTTRACKER_OVERVIEW_SUCCESS:
      return {
        ...state,
        costTrackerOverviewData: action.payload,
      };
      
    case costTrackerType.FETCH_DIESEL_OVERVIEW_LOADING:
      return {
        ...state,
        fetchDieselOverviewLoading: action.payload,
      };
    case costTrackerType.FETCH_DIESEL_OVERVIEW_SUCCESS:
      return {
        ...state,
        dieselOverviewData: action.payload,
      };

    case costTrackerType.FETCH_UTILITY_OVERVIEW_LOADING:
      return {
        ...state,
        fetchUtilityOverviewLoading: action.payload,
      };
    case costTrackerType.FETCH_UTILITY_OVERVIEW_SUCCESS:
      return {
        ...state,
        utilityOverviewData: action.payload,
      };
      
    case costTrackerType.FETCH_IPP_OVERVIEW_LOADING:
      return {
        ...state,
        fetchIppOverviewLoading: action.payload,
      };
    case costTrackerType.FETCH_IPP_OVERVIEW_SUCCESS:
      return {
        ...state,
        ippOverviewData: action.payload,
      };

    case costTrackerType.FETCH_COSTTRACKER_BASELINE_LOADING:
      return {
        ...state,
        fetchCostTrackerBaselineLoading: action.payload,
      };
    case costTrackerType.FETCH_COSTTRACKER_BASELINE_SUCCESS:
      return {
        ...state,
        CostTrackerBaselineData: action.payload,
      };

    case costTrackerType.FETCH_FUEL_CONSUMPTION_DATA_SUCCESS:
      return {
        ...state,
        fuelConsumptionData: action.payload,
      };
    case costTrackerType.FETCH_FUEL_CONSUMPTION_DATA_LOADING:
      return {
        ...state,
        fuelConsumptionDataLoading: action.payload,
      };

    case costTrackerType.FETCH_GENERATOR_LISTS_SUCCESS:
      return {
        ...state,
        fetchedListOfGenerators: action.payload,
      };
    case costTrackerType.FETCH_GENERATOR_LISTS_LOADING:
      return {
        ...state,
        listOfGeneratorsLoading: action.payload,
      };

    case costTrackerType.ADD_FUEL_CONSUMPTION_DATA_LOADING:
      return {
        ...state,
        addFuelConsumptionLoadin: action.payload,
      };

    case costTrackerType.ADD_MONTHLY_FUEL_CONSUMPTION_DATA_LOADING:
      return {
        ...state,
        addMonthlyFuelConsumptionDataLoadin: action.payload,
      };
    case costTrackerType.ADD_MONTHLY_FUEL_CONSUMPTION_DATA_SUCCESS:
      return {
        ...state,
        addMonthlyFuelConsumptiondata: action.payload,
      };

    case costTrackerType.EDIT_FUEL_CONSUMPTION_DATA_LOADING:
      return {
        ...state,
        editFuelConsumptionDataLoadin: action.payload,
      };
    case costTrackerType.EDIT_FUEL_CONSUMPTION_DATA_SUCCESS:
      return {
        ...state,
        editedFuelConsumptiondata: action.payload,
      };

    case costTrackerType.DELETE_FUEL_CONSUMPTION_DATA_LOADING:
      return {
        ...state,
        deleteFuelConsumptionDataLoadin: action.payload,
      };
    case costTrackerType.DELETE_FUEL_CONSUMPTION_DATA_SUCCESS:
      return {
        ...state,
        deletedFuelConsumptiondata: action.payload,
      };
      
    case costTrackerType.EDIT_FUEL_PURCHASE_DATA_LOADING:
      return {
        ...state,
        editFuelPurchaseDataLoadin: action.payload,
      };
    case costTrackerType.EDIT_FUEL_PURCHASE_DATA_SUCCESS:
      return {
        ...state,
        editedFuelPurchaseData: action.payload,
      };

    case costTrackerType.DELETE_FUEL_PURCHASE_DATA_LOADING:
      return {
        ...state,
        deleteFuelPurchaseDataLoadin: action.payload,
      };
    case costTrackerType.DELETE_FUEL_PURCHASE_DATA_SUCCESS:
      return {
        ...state,
        deletedFuelPurchaseData: action.payload,
      };

    case costTrackerType.EDIT_PRE_UTILITY_PURCHASE_DATA_LOADING:
      return {
        ...state,
        editPreUtilityPurchaseDataLoadin: action.payload,
      };
    case costTrackerType.EDIT_PRE_UTILITY_PURCHASE_DATA_SUCCESS:
      return {
        ...state,
        editedPreUtilityPurchaseData: action.payload,
      };

    case costTrackerType.DELETE_PRE_UTILITY_PURCHASE_DATA_LOADING:
      return {
        ...state,
        deletePreUtilityPurchaseDataLoadin: action.payload,
      };
    case costTrackerType.DELETE_PRE_UTILITY_PURCHASE_DATA_SUCCESS:
      return {
        ...state,
        deletedPreUtilityPurchaseData: action.payload,
      };
      
    case costTrackerType.EDIT_IPP_PURCHASE_DATA_LOADING:
        return {
          ...state,
          editIppPurchaseDataLoadin: action.payload,
        };
    case costTrackerType.EDIT_IPP_PURCHASE_DATA_SUCCESS:
        return {
          ...state,
          editedIppPurchaseData: action.payload,
        };
    
    case costTrackerType.DELETE_IPP_PURCHASE_DATA_LOADING:
          return {
            ...state,
            deleteIppPurchaseDataLoadin: action.payload,
          };
    case costTrackerType.DELETE_IPP_PURCHASE_DATA_SUCCESS:
          return {
            ...state,
            deletedIppPurchaseData: action.payload,
          };
    
    case costTrackerType.EDIT_POST_UTILITY_PURCHASE_DATA_LOADING:
      return {
        ...state,
        editPostUtilityPurchaseDataLoadin: action.payload,
      };
    case costTrackerType.EDIT_POST_UTILITY_PURCHASE_DATA_SUCCESS:
      return {
        ...state,
        editedPostUtilityPurchaseData: action.payload,
      };

    default: return state;

  }

};

export default reducer;