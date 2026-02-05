import { fetchSideBarLoading, fetchSideBarSuccess } from "./actionCreators";
import { APIService } from "../../../config/api/apiConfig";


export const fetchSideBar = () => async (dispatch) => {
  dispatch(fetchSideBarLoading());

  const requestUrl = `side_bar_data`
  try {
    const response = await APIService.get(requestUrl);
    dispatch(fetchSideBarSuccess(response.data.authenticatedData));
    dispatch(fetchSideBarLoading(false))
  } catch (error) {
    dispatch(fetchSideBarLoading(error));
  }
};