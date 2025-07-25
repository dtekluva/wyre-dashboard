import authTypes from './auth.types';

const INITIAL_STATE = {
    fetchBillingLoading: false,
    billingData: {},

    fetchPermittedBranchesLoading: false,
    permittedBranches: false,

    switchNewBranchLoading: false,
    switchedNewBranch: false,
};

const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case authTypes.LOGOUT_USER:
            return {
                ...state,
                fetchBillingLoading: action.payload,
            };
            
        case authTypes.GET_PERMITTED_BRANCHES_LOADING:
            return {
                ...state,
                fetchPermittedBranchesLoading: action.payload,
            };
        case authTypes.GET_PERMITTED_BRANCHES_SUCCESS:
            console.log('Reducer GET_PERMITTED_BRANCHES_SUCCESS:', action.payload);
            return {
                ...state,
                permittedBranches: action.payload,
            };

        case authTypes.SWITCH_BRANCH_LOADING:
            return {
                ...state,
                switchNewBranchLoading: action.payload,
            };
        case authTypes.SWITCH_BRANCH_SUCCESS:
            return {
                ...state,
                switchedNewBranch: action.payload,
            };

        default: return state;
    }
};
export default reducer;