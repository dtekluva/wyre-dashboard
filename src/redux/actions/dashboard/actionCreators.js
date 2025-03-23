
// const dashBoardType 

import dashBoardType from "../../reducers/dashboard/dashboard.types";

export const fetchDashBoardLoading = (payload = true) => ({
    type: dashBoardType.FETCH_DASHBOARD_LOADING,
    payload,
  });
export const fetchDashBoardSuccess = payload => ({
    type: dashBoardType.FETCH_DASHBOARD_SUCCESS,
    payload,
  });

export const fetchDashBoardCard_1_Loading = (payload = true) => ({
    type: dashBoardType.FETCH_DASHBOARD_CARD_1_LOADING,
    payload,
  });
export const fetchDashBoardCard_1_Success = payload => ({
    type: dashBoardType.FETCH_DASHBOARD_CARD_1_SUCCESS,
    payload,
  });

export const fetchDashBoardCard_2_Loading = (payload = true) => ({
    type: dashBoardType.FETCH_DASHBOARD_CARD_2_LOADING,
    payload,
  });
export const fetchDashBoardCard_2_Success = payload => ({
    type: dashBoardType.FETCH_DASHBOARD_CARD_2_SUCCESS,
    payload,
  });

export const fetchDashBoardCard_3_Loading = (payload = true) => ({
    type: dashBoardType.FETCH_DASHBOARD_CARD_3_LOADING,
    payload,
  });
export const fetchDashBoardCard_3_Success = payload => ({
    type: dashBoardType.FETCH_DASHBOARD_CARD_3_SUCCESS,
    payload,
  });

export const fetchLoadOverview_Loading = (payload = true) => ({
    type: dashBoardType.FETCH_LOAD_OVERVIEW_LOADING,
    payload,
  });
export const fetchLoadOverview_Success = payload => ({
    type: dashBoardType.FETCH_LOAD_OVERVIEW_SUCCESS,
    payload,
  });

export const fetchDemandLoading = (payload = true) => ({
    type: dashBoardType.FETCH_DEMAND_LOADING,
    payload,
  });  
export const fetchDemandSuccess = payload => ({
    type: dashBoardType.FETCH_DEMAND_SUCCESS,
    payload,
  });

export const fetchBlendedCostEnergyLoading = (payload = true) => ({
    type: dashBoardType.FETCH_BLENDEDCOST_ENERGY_LOADING,
    payload,
  }); 
export const fetchBlendedCostEnergySuccess = payload => ({
    type: dashBoardType.FETCH_BLENDEDCOST_ENERGY_SUCCESS,
    payload,
  });
  