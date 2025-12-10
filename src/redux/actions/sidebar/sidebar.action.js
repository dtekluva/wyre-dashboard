
import axios from "axios";
import jwtDecode from "jwt-decode";
import EnvData from "../../../config/EnvData";
import { fetchSideBarLoading, fetchSideBarSuccess } from "./actionCreators";
import { APIService } from "../../../config/api/apiConfig";


export const fetchSideBar = () => async (dispatch) => {
  dispatch(fetchSideBarLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  const requestUrl = `side_bar_data`
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchSideBarSuccess(response.data.authenticatedData));
    dispatch(fetchSideBarLoading(false))
  } catch (error) {
    dispatch(fetchSideBarLoading(error));
  }
};