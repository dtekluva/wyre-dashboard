
import dashBoardType from './dashboard.types';

const INITIAL_STATE = {
   fetchDashBoardLoading: false,
   dashBoardData: false,
   fetchDashBoardCard_1_Loading: false,
   dashBoardCard_1_Data: false,
   fetchDashBoardCard_2_Loading: false,
   dashBoardCard_2_Data: false,
   fetchDashBoardCard_3_Loading: false,
   dashBoardCard_3_Data: false,
   fetchDemandLoading: false,
   demandData: false,
   fetchBlendedCostEnergyLoading: false,
   blendedCostEnergyData: false,
   billingDataLoading: false,
   billingData: false,
};

const reducer = (state = INITIAL_STATE, action) => {

   switch (action.type) {

      case dashBoardType.FETCH_DASHBOARD_LOADING:
         return {
            ...state,
            fetchDashBoardLoading: action.payload,
         };
      case dashBoardType.FETCH_DASHBOARD_SUCCESS:
         return {
            ...state,
            dashBoardData: action.payload,
         };

      case dashBoardType.FETCH_DASHBOARD_CARD_1_LOADING:
         return {
            ...state,
            fetchDashBoardCard_1_Loading: action.payload,
         };
      case dashBoardType.FETCH_DASHBOARD_CARD_1_SUCCESS:
         return {
            ...state,
            dashBoardCard_1_Data: action.payload,
         };
         
      case dashBoardType.FETCH_DASHBOARD_CARD_2_LOADING:
         return {
            ...state,
            fetchDashBoardCard_2_Loading: action.payload,
         };
      case dashBoardType.FETCH_DASHBOARD_CARD_2_SUCCESS:
         return {
            ...state,
            dashBoardCard_2_Data: action.payload,
         };

      case dashBoardType.FETCH_DASHBOARD_CARD_3_LOADING:
         return {
            ...state,
            fetchDashBoardCard_3_Loading: action.payload,
         };
      case dashBoardType.FETCH_DASHBOARD_CARD_3_SUCCESS:
         return {
            ...state,
            dashBoardCard_3_Data: action.payload,
         };

      case dashBoardType.FETCH_DEMAND_SUCCESS:
         return {
            ...state,
            demandData: action.payload,
         };
      case dashBoardType.FETCH_DEMAND_LOADING:
         return {
            ...state,
            fetchDemandLoading: action.payload,
         };

      case dashBoardType.FETCH_BILLING_LOADING:
         return {
            ...state,
            billingDataLoading: action.payload,
         };
      case dashBoardType.FETCH_BLENDEDCOST_ENERGY_SUCCESS:
         return {
            ...state,
            blendedCostEnergyData: action.payload,
         };

      case dashBoardType.FETCH_BLENDEDCOST_ENERGY_LOADING:
         return {
            ...state,
            fetchBlendedCostEnergyLoading: action.payload,
         };
      case dashBoardType.FETCH_BILLING_SUCCESS:
         return {
            ...state,
            billingData: action.payload,
         };

      default: return state;

   }

};

export default reducer;