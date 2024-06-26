
import axios from "axios";
import EnvData from "../../../config/EnvData";
import {
  fetchScoreCardLoading,
  fetchScoreCardSuccess
} from "./actionCreators";
import dataHttpServices from '../../../services/devices';
import moment from 'moment';
import jwtDecode from "jwt-decode";


export const fetchScoreCardData = (userDateRange) => async (dispatch) => {
  dispatch(fetchScoreCardLoading());

  const loggedUserJSON = localStorage.getItem('loggedWyreUser');
  let userId;
  let token;
  const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
  if (loggedUserJSON) {
    const userToken = JSON.parse(loggedUserJSON);
    const user = jwtDecode(userToken.access)
    userId = user.id;
    token = userToken.access;
  }
  try {
    const response = await axios.get(
      `${EnvData.REACT_APP_API_URL}scorecard/${userId}/${dateToUse}/${dataHttpServices.endpointDataTimeInterval}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchScoreCardSuccess(response.data.authenticatedData));
    dispatch(fetchScoreCardLoading(false))
  } catch (error) {
    dispatch(fetchScoreCardLoading(false));
  }
};


