import authTypes from './auth.types';

const INITIAL_STATE = {
    resetPasswordLoading: false,
    resetPasswordData: null,

    confirmResetPasswordLoading: false,
    confirmResetPasswordData: null,

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
            
        case authTypes.RESET_PASSWORD_LOADING:
            return {
                ...state,
                resetPasswordLoading: action.payload,
            };
        case authTypes.RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPasswordData: action.payload,
            };

        case authTypes.CONFIRM_RESET_PASSWORD_LOADING:
            return {
                ...state,
                confirmResetPasswordLoading: action.payload,
            };
        case authTypes.CONFIRM_RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                confirmResetPasswordData: action.payload,
            };

        case authTypes.GET_PERMITTED_BRANCHES_LOADING:
            return {
                ...state,
                fetchPermittedBranchesLoading: action.payload,
            };
        case authTypes.GET_PERMITTED_BRANCHES_SUCCESS:
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