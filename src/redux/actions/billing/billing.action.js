
import axios from "axios";
import EnvData from "../../../config/EnvData";
import { fetchBillingLoading, fetchBillingSuccess } from "./actionCreators";
import dataHttpServices from '../../../services/devices';
import { jwtDecode } from 'jwt-decode';
import moment from "moment";



export const fetchBillingData = (userDateRange) => async (dispatch) => {
  dispatch(fetchBillingLoading());

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

    const dateToUse = userDateRange && userDateRange.length > 0 ? `${moment(userDateRange[0]).format('DD-MM-YYYY HH:mm') + '/' + moment(userDateRange[1]).format('DD-MM-YYYY HH:mm')}` : dataHttpServices.endpointDateRange
    const response = await axios.get(
      // /api/v1/billing_data/id/start_date/end_date
      // `${EnvData.REACT_APP_API_URL}billing_data/${userId}/${dataHttpServices.endpointDateRange}`, {
      `${EnvData.REACT_APP_API_URL}billing_data/${userId}/${dateToUse}`, {
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
    );
    dispatch(fetchBillingSuccess(response.data.authenticatedData));
    dispatch(fetchBillingLoading(false))
  } catch (error) {
    dispatch(fetchBillingLoading(error));
  }
};