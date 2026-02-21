import axios from 'axios';
import { logoutUser, getPermittedBranchesLoading, getPermittedBranchesSuccess, switchBranchLoading, switchBranchSuccess } from "./actionCreators";
import EnvData from '../../../config/EnvData';
import { resetPasswordLoading, resetPasswordSuccess, confirmResetPasswordLoading, confirmResetPasswordSuccess, validateResetTokenLoading, validateResetTokenSuccess } from './actionCreators';


export const logoutUserFromRedux = () => async (dispatch) => {
  dispatch(logoutUser());
};

export const resetPasswordAction = (data) => async (dispatch) => {
  dispatch(resetPasswordLoading(true));
  try {
    const requestUrl = EnvData.REACT_APP_API_URL + 'accounts/reset_password/';
    const config = {};
    const loggedUserJSON = localStorage.getItem('loggedWyreUser');
    if (loggedUserJSON) {
      try {
        const userToken = JSON.parse(loggedUserJSON);
        if (userToken.access) {
          config.headers = { Authorization: `Bearer ${userToken.access}` };
        }
      } catch (_) {}
    }
    const response = await axios.post(requestUrl, data, config);
    dispatch(resetPasswordSuccess(response.data.message));
    dispatch(resetPasswordLoading(false));
    return { fulfilled: true, message: response.data.message };
  } catch (error) {
    dispatch(resetPasswordLoading(false));
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'Request failed';
    return { fulfilled: false, message };
  }
};

export const confirmResetPasswordAction = (data) => async (dispatch) => {
  dispatch(confirmResetPasswordLoading(true));
  try {
    const requestUrl = EnvData.REACT_APP_API_URL + 'accounts/confirm_reset_password/';
    const response = await axios.post(requestUrl, data);
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
    const requestUrl = EnvData.REACT_APP_API_URL + 'validate_reset_token/?token=' + encodeURIComponent(token.trim());
    const response = await axios.get(requestUrl);
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
    const requestUrl = EnvData.REACT_APP_API_BASE_URL + 'token/refresh/';
    if (localStorage.loggedWyreUser) {
      const user = JSON.parse(localStorage.loggedWyreUser);
      const response = await axios.post(requestUrl, {
        refresh: user.refresh,
      });
      const newUser = { access: response.data.accces, ...user, }
      localStorage.setItem('loggedWyreUser', JSON.stringify(newUser));
    }
  } catch (error) {
    localStorage.clear();
    window.href = '/'
  }

};
export const changePassword = async (data) => {
  try {
    const requestUrl = EnvData.REACT_APP_API_URL + 'reset_password/';
    if (localStorage.loggedWyreUser) {
      const response = await axios.post(requestUrl, data);

      return { fulfilled: true, message: response.data.message }
      // log user out here
    }
  } catch (error) {
    return { fulfilled: false, message: error.response.data.message }
  }

};

export const getPermittedBranches = () => async (dispatch) => {
  dispatch(getPermittedBranchesLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let token;

  if (loggedUserJSON) {
    try {
      const userToken = JSON.parse(loggedUserJSON);
      if (userToken.access) {
        token = userToken.access;
      }
    } catch (_parseError) {
      dispatch(getPermittedBranchesLoading(false));
      return;
    }
  }

  if (!token) {
    dispatch(getPermittedBranchesLoading(false));
    return;
  }

  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}accounts/user/permitted-branches/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
  let token;

  if (loggedUserJSON) {
    try {
      const userToken = JSON.parse(loggedUserJSON);
      if (userToken.access) {
        token = userToken.access;
      }
    } catch (_parseError) {
      dispatch(switchBranchLoading(false));
      return;
    }
  }

  if (!token) {
    dispatch(switchBranchLoading(false));
    return;
  }

  try {
    const response = await axios.post(
      `${EnvData.REACT_APP_API_URL}force-login/${branchId}/`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    dispatch(switchBranchSuccess(response.data));
    dispatch(switchBranchLoading(false));
  } catch (error) {
    dispatch(switchBranchLoading(false));
  }
};