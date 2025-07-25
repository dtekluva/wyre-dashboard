


import authTypes from "../../reducers/auth/auth.types";

export const logoutUser = (payload = true) => ({
    type: authTypes.LOGOUT_USER,
    payload,
});

export const getPermittedBranchesLoading = (payload = true) => ({
    type: authTypes.GET_PERMITTED_BRANCHES_LOADING,
    payload,
});
export const getPermittedBranchesSuccess = (payload) => {
    console.log('getPermittedBranchesSuccess called with payload:', payload);
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