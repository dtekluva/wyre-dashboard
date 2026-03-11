import { APIService, APIServiceNoAuth, BaseAPIService } from '../../../config/api/apiConfig';
import { logoutUser, getPermittedBranchesLoading, getPermittedBranchesSuccess, switchBranchLoading, switchBranchSuccess } from "./actionCreators";
import { resetPasswordLoading, resetPasswordSuccess, confirmResetPasswordLoading, confirmResetPasswordSuccess, validateResetTokenLoading, validateResetTokenSuccess } from './actionCreators';


export const logoutUserFromRedux = () => async (dispatch) => {
  dispatch(logoutUser());
};

export const resetPasswordAction = (data) => async (dispatch) => {
  dispatch(resetPasswordLoading(true));
  try {
    const response = await APIServiceNoAuth.post('accounts/reset_password/', data);
    dispatch(resetPasswordSuccess(response.data.message));
    dispatch(resetPasswordLoading(false));
    return { fulfilled: true, message: response.data.message };
  } catch (error) {
    dispatch(resetPasswordLoading(false));
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Request failed';
    return { fulfilled: false, message };
  }
};

export const confirmResetPasswordAction = (payload) => async (dispatch) => {
  dispatch(confirmResetPasswordLoading(true));
  try {
    const { token, new_password } = payload;
    const response = await APIServiceNoAuth.post('accounts/confirm_reset_password/', { token, new_password });
    dispatch(confirmResetPasswordSuccess(response.data.message));
    dispatch(confirmResetPasswordLoading(false));
    return { fulfilled: true, message: response.data.message };
  } catch (error) {
    dispatch(confirmResetPasswordLoading(false));
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Request failed';
    return { fulfilled: false, message };
  }
};

export const validateResetTokenAction = (token) => async (dispatch) => {
  if (!token?.trim()) {
    dispatch(validateResetTokenSuccess({ validatedToken: '', valid: false, reason: 'missing' }));
    return;
  }
  dispatch(validateResetTokenLoading(true));
  try {
    const response = await APIServiceNoAuth.get('validate_reset_token/?token=' + encodeURIComponent(token.trim()));
    const { valid, reason } = response.data || {};
    dispatch(validateResetTokenSuccess({
      validatedToken: token.trim(),
      valid: !!valid,
      reason: reason || (valid ? null : 'invalid'),
    }));
  } catch (error) {
    dispatch(validateResetTokenSuccess({
      validatedToken: token.trim(),
      valid: false,
      reason: error.response?.data?.reason || 'invalid',
    }));
  }
};

export const getNewRefreshToken = async () => {
  try {
    if (localStorage.loggedWyreUser) {
      const user = JSON.parse(localStorage.loggedWyreUser);
      const response = await BaseAPIService.post('token/refresh/', {
        refresh: user.refresh,
      });
      const newUser = { access: response.data.accces, ...user };
      localStorage.setItem('loggedWyreUser', JSON.stringify(newUser));
    }
  } catch (error) {
    localStorage.clear();
    window.href = '/';
  }
};
export const changePassword = async (data) => {
  try {
    if (localStorage.loggedWyreUser) {
      const response = await APIService.post('reset_password/', data);
      return { fulfilled: true, message: response.data.message };
    }
  } catch (error) {
    return { fulfilled: false, message: error.response?.data?.message };
  }
};

export const getPermittedBranches = () => async (dispatch) => {
  dispatch(getPermittedBranchesLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  if (!loggedUserJSON) {
    dispatch(getPermittedBranchesLoading(false));
    return;
  }

  try {
    const userToken = JSON.parse(loggedUserJSON);
    if (!userToken?.access) {
      dispatch(getPermittedBranchesLoading(false));
      return;
    }
  } catch (_parseError) {
    dispatch(getPermittedBranchesLoading(false));
    return;
  }

  try {
    const response = await APIService.get('accounts/user/permitted-branches/');
    dispatch(getPermittedBranchesSuccess(response.data));
    dispatch(getPermittedBranchesLoading(false));
  } catch (error) {
    dispatch(getPermittedBranchesLoading(false));
  }
};

export const switchBranch = (branchId) => async (dispatch) => {
  dispatch(switchBranchLoading());

  if (!branchId) {
    dispatch(switchBranchLoading(false));
    return;
  }

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  if (!loggedUserJSON) {
    dispatch(switchBranchLoading(false));
    return;
  }

  try {
    const userToken = JSON.parse(loggedUserJSON);
    if (!userToken?.access) {
      dispatch(switchBranchLoading(false));
      return;
    }
  } catch (_parseError) {
    dispatch(switchBranchLoading(false));
    return;
  }

  try {
    const response = await APIService.post(`force-login/${branchId}/`, {});
    dispatch(switchBranchSuccess(response.data));
    dispatch(switchBranchLoading(false));
  } catch (error) {
    dispatch(switchBranchLoading(false));
  }
};