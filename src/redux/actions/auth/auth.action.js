import axios from 'axios';
import { logoutUser, getPermittedBranchesLoading, getPermittedBranchesSuccess, switchBranchLoading, switchBranchSuccess } from "./actionCreators";
import EnvData from '../../../config/EnvData';
import jwtDecode from 'jwt-decode';


export const logoutUserFromRedux = () => async (dispatch) => {
  dispatch(logoutUser());
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
      const user = JSON.parse(localStorage.loggedWyreUser);
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
  let userId;
  let token;

  if (loggedUserJSON) {
    try {
      const userToken = JSON.parse(loggedUserJSON);
      if (userToken.access) {
        const user = jwtDecode(userToken.access);
        userId = user.id;
        token = userToken.access;
      }
    } catch (parseError) {
      console.error('Error parsing user token:', parseError);
      dispatch(getPermittedBranchesLoading(false));
      return;
    }
  }

  if (!token) {
    console.error('No authentication token found');
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
    console.error('Error fetching permitted branches:', error);
    dispatch(getPermittedBranchesLoading(false));
  }
};

export const switchBranch = (branchId) => async (dispatch) => {
  dispatch(switchBranchLoading());

  if (!branchId) {
    console.error('Branch ID is required');
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
    } catch (parseError) {
      console.error('Error parsing user token:', parseError);
      dispatch(switchBranchLoading(false));
      return;
    }
  }

  if (!token) {
    console.error('No authentication token found');
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
    console.error('Error switching branch:', error);
    dispatch(switchBranchLoading(false));
  }
};