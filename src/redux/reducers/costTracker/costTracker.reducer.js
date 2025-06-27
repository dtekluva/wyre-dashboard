
import costTrackerType from './costTracker.types';

const INITIAL_STATE = {
  fetchCostTrackerLoading: false,
  costTrackerData: false,
  
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