import scoreCardType from "../../reducers/scorecard/scorecard.types";

export const fetchScoreCardLoading = (payload = true) => ({
    type: scoreCardType.FETCH_SCORECARD_LOADING,
    payload,
  });  
export const fetchScoreCardSuccess = payload => ({
    type: scoreCardType.FETCH_SCORECARD_SUCCESS,
    payload,
  });

export const fetchScoreCardUiLoading = (payload = true) => ({
    type: scoreCardType.FETCH_SCORECARD_UI_LOADING,
    payload,
  });  
export const fetchScoreCardUiSuccess = payload => ({
    type: scoreCardType.FETCH_SCORECARD_UI_SUCCESS,
    payload,
  });

export const getBaselineEnergyLoading = (payload = true) => ({
    type: scoreCardType.GET_BASELINE_ENERGY_LOADING,
    payload,
  });  
export const getBaselineEnergySuccess = payload => ({
    type: scoreCardType.GET_BASELINE_ENERGY_SUCCESS,
    payload,
  });

export const getPAPRLoading = (payload = true) => ({
    type: scoreCardType.GET_PAPR_LOADING,
    payload,
  });  
export const getPAPRSuccess = payload => ({
    type: scoreCardType.GET_PAPR_SUCCESS,
    payload,
  });

export const getScorecardCarbonEmissionLoading = (payload = true) => ({
    type: scoreCardType.GET_SCORECARD_CARBON_EMISSION_LOADING,
    payload,
  });  
export const getScorecardCarbonEmissionSuccess = payload => ({
    type: scoreCardType.GET_SCORECARD_CARBON_EMISSION_SUCCESS,
    payload,
  });

export const getGeneratorSizeEfficiencyLoading = (payload = true) => ({
    type: scoreCardType.GET_GENERATOR_SIZE_EFFICIENCY_LOADING,
    payload,
  }); 
export const getGeneratorSizeEfficiencySuccess = payload => ({
    type: scoreCardType.GET_GENERATOR_SIZE_EFFICIENCY_SUCCESS,
    payload,
  });

export const getGeneratorFuelEfficiencyLoading = (payload = true) => ({
    type: scoreCardType.GET_GENERATOR_FUEL_EFFICIENCY_LOADING,
    payload,
  }); 
export const getGeneratorFuelEfficiencySuccess = payload => ({
    type: scoreCardType.GET_GENERATOR_FUEL_EFFICIENCY_SUCCESS,
    payload,
  });

export const getOperatingTimeDeviationLoading = (payload = true) => ({
    type: scoreCardType.GET_OPERATING_TIME_DEVIATION_LOADING,
    payload,
  }); 
export const getOperatingTimeDeviationSuccess = payload => ({
    type: scoreCardType.GET_OPERATING_TIME_DEVIATION_SUCCESS,
    payload,
  });


  