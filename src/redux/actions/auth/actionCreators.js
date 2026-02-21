


import authTypes from "../../reducers/auth/auth.types";

export const logoutUser = (payload = true) => ({
    type: authTypes.LOGOUT_USER,
    payload,
});

export const resetPasswordLoading = (payload = true) => ({
    type: authTypes.RESET_PASSWORD_LOADING,
    payload,
});
export const resetPasswordSuccess = (payload) => ({
    type: authTypes.RESET_PASSWORD_SUCCESS,
    payload,
});

export const confirmResetPasswordLoading = (payload = true) => ({
    type: authTypes.CONFIRM_RESET_PASSWORD_LOADING,
    payload,
});
export const confirmResetPasswordSuccess = (payload) => ({
    type: authTypes.CONFIRM_RESET_PASSWORD_SUCCESS,
    payload,
});

export const validateResetTokenLoading = (payload = true) => ({
    type: authTypes.VALIDATE_RESET_TOKEN_LOADING,
    payload,
});
export const validateResetTokenSuccess = (payload) => ({
    type: authTypes.VALIDATE_RESET_TOKEN_SUCCESS,
    payload,
});

export const getPermittedBranchesLoading = (payload = true) => ({
    type: authTypes.GET_PERMITTED_BRANCHES_LOADING,
    payload,
});
export const getPermittedBranchesSuccess = (payload) => {
    return {
        type: authTypes.GET_PERMITTED_BRANCHES_SUCCESS,
        payload,
    };
};

export const switchBranchLoading = (payload = true) => ({
    type: authTypes.SWITCH_BRANCH_LOADING,
    payload,
});
export const switchBranchSuccess = (payload) => ({
    type: authTypes.SWITCH_BRANCH_SUCCESS,
    payload,
});