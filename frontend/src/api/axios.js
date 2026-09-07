import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true // sends/receives the httpOnly auth cookie
});

export default api;
