import EnvData from "../../../config/EnvData";
import {
  fetchReportBaseLineLoading,
  fetchReportBaselineSuccess,
  fetchReportLoading,
  fetchReportSuccess,
} from "./actionCreators";
import { APIService } from "../../../config/api/apiConfig";
import jwtDecode from "jwt-decode";

export const fetchReportData = (date, type) => async (dispatch) => {
  dispatch(fetchReportLoading());
  try {
    const loggedUserJSON = localStorage.getItem("loggedWyreUser");
    let userId;
    if (loggedUserJSON) {
      const userToken = JSON.parse(loggedUserJSON);
      const user = jwtDecode(userToken.access);
      userId = user.id;
    }
    const requestUrl = `${EnvData.REACT_APP_API_URL}get_reports/${userId}/${date}%2000:00/${type}`;
    const response = await APIService.get(requestUrl);
    console.log("Report Data:", response.data.data);
    dispatch(fetchReportSuccess(response.data.data));
    dispatch(fetchReportLoading(false));
  } catch (error) {
    dispatch(fetchReportLoading(false));
  }
};

export const fetchBaseLineData = (date, type) => async (dispatch) => {
  dispatch(fetchReportBaseLineLoading());
  try {
    const loggedUserJSON = localStorage.getItem("loggedWyreUser");
    let userId;
    if (loggedUserJSON) {
      const userToken = JSON.parse(loggedUserJSON);
      const user = jwtDecode(userToken.access);
      userId = user.id;
    }
    const requestUrl = `${EnvData.REACT_APP_API_URL}get_reports_baseline/${userId}/${date}%2000:00/${type}`;
    const response = await APIService.get(requestUrl);
    dispatch(fetchReportBaselineSuccess(response.data.data));
    dispatch(fetchReportBaseLineLoading(false));
  } catch (error) {
    dispatch(fetchReportBaseLineLoading(false));
  }
};
