
import axios from "axios";
import jwtDecode from "jwt-decode";
import EnvData from "../../../config/EnvData";
import { fetchSideBarLoading, fetchSideBarSuccess } from "./actionCreators";


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
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}side_bar_data`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchSideBarSuccess(response.data.authenticatedData));
    dispatch(fetchSideBarLoading(false))
  } catch (error) {
    dispatch(fetchSideBarLoading(error));
  }
};