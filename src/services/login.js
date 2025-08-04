import axios from 'axios';
const baseUrl = 'https://backend.wyreng.com/api/v1/auth/';
// let baseUrl = `http://localhost:8000/api/v1/auth/`;

const baseUrl2 = 'https://backend.wyreng.com/token/';

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};
const login2 = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  return response.data;
};

// eslint-disable-next-line
export default { login, login2 };
