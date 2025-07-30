
import { fetchScoreCardUiLoading } from '../../actions/scorecard/actionCreators';
import scoreCardType from './scorecard.types';

const INITIAL_STATE = {
   fetchScoreCardLoading: false,
   scoreCardData: false,

   fetchScoreCardUiLoading: false,
   scoreCardDataUi: false,

   fetchBaselineEnergyLoading: false,
   baselineEnergyData: false,

   fetchPAPRLoading: false,
   paprData: false,

   fetchScorecardCarbonEmissionLoading: false,
   scorecardCarbonEmissionData: false,

   fetchGeneratorSizeEfficiencyLoading: false,
   generatorSizeEfficiencyData: false,

   fetchGeneratorFuelEfficiencyLoading: false,
   generatorFuelEfficiencyData: false,
   
   fetchOperatingtimeDeviationLoading: false,
   operatingTimeDeviationData: false,
};
console.log('INITIAL_STATE', INITIAL_STATE);


const reducer = (state = INITIAL_STATE, action) => {

   switch (action.type) {

      case scoreCardType.FETCH_SCORECARD_LOADING:
         return {
            ...state,
            fetchScoreCardLoading: action.payload,
         };
      case scoreCardType.FETCH_SCORECARD_SUCCESS:
         return {
            ...state,
            scoreCardData: action.payload,
         };
         
      case scoreCardType.FETCH_SCORECARD_UI_LOADING:
         return {
            ...state,
            fetchScoreCardUiLoading: action.payload,
         };
      case scoreCardType.FETCH_SCORECARD_UI_SUCCESS:
         return {
            ...state,
            scoreCardDataUi: action.payload,
         };

      case scoreCardType.GET_BASELINE_ENERGY_LOADING:
         return {
            ...state,
            fetchBaselineEnergyLoading: action.payload,
         };
      case scoreCardType.GET_BASELINE_ENERGY_SUCCESS:
         return {
            ...state,
            baselineEnergyData: action.payload,
         };

      case scoreCardType.GET_PAPR_LOADING:
            return {
               ...state,
               fetchPAPRLoading: action.payload,
            };
      case scoreCardType.GET_PAPR_SUCCESS:
            return {
               ...state,
               paprData: action.payload,
            };

      case scoreCardType.GET_SCORECARD_CARBON_EMISSION_LOADING:
         return {
            ...state,
            fetchScorecardCarbonEmissionLoading: action.payload,
         };
      case scoreCardType.GET_SCORECARD_CARBON_EMISSION_SUCCESS:
         return {
            ...state,
            scorecardCarbonEmissionData: action.payload,
         };

      case scoreCardType.GET_GENERATOR_SIZE_EFFICIENCY_LOADING:
         return {
            ...state,
            fetchGeneratorSizeEfficiencyLoading: action.payload,
         };
      case scoreCardType.GET_GENERATOR_SIZE_EFFICIENCY_SUCCESS:
         return {
            ...state,
            generatorSizeEfficiencyData: action.payload,
         };

      case scoreCardType.GET_GENERATOR_FUEL_EFFICIENCY_LOADING:
         return {
            ...state,
            fetchGeneratorFuelEfficiencyLoading: action.payload,
         };
      case scoreCardType.GET_GENERATOR_FUEL_EFFICIENCY_SUCCESS:
         return {
            ...state,
            generatorFuelEfficiencyData: action.payload,
         };

      case scoreCardType.GET_OPERATING_TIME_DEVIATION_LOADING:
         return {
            ...state,
            fetchOperatingtimeDeviationLoading: action.payload,
         };
      case scoreCardType.GET_OPERATING_TIME_DEVIATION_SUCCESS:
         return {
            ...state,
            operatingTimeDeviationData: action.payload,
         };        

      default: return state;

   }

};

export default reducer;