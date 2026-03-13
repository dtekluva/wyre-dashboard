import axios from 'axios'
import EnvData from '../config/EnvData';

const BASE_URL = `${EnvData.REACT_APP_API_URL}`;
const costTrackerUrl = `${BASE_URL}cost_tracker`;


const addCostForDiesel = async (DataObject, token, userId, fuelType) =>{
    const postRequest = axios.post(`${costTrackerUrl}/${userId}/add_cost/${fuelType}/`, DataObject, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          }
    })
    const res = await postRequest
    return res.data
}
const addCostPrePaid = async (data, token, userId) =>{
    const postRequest = axios.post(`${costTrackerUrl}/${userId}/add_cost/pre-paid/`, data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          }
    })
    const response = await postRequest
    return response.data
}

const addCostIpp = async (data, token, userId) =>{
    const postRequest = axios.post(`${costTrackerUrl}/${userId}/add_cost/ipp/`, data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          }
    })
    const response = await postRequest
    return response.data
}


const addCostPostPaid  = async (data, token, userId) =>{
    const postRequest = axios.post(`${costTrackerUrl}/${userId}/add_cost/post-paid/`, data, {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          }
    })
    const res = await postRequest
    return res.data
}
// eslint-disable-next-line
export default{
    addCostForDiesel,
    addCostPostPaid,
    addCostPrePaid,
    addCostIpp
};