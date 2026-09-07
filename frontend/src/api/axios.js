import axios from 'axios';

// In dev, '/api' is proxied to the local backend (see vite.config.js). In production the
// frontend and backend are typically deployed separately, so VITE_API_URL must point at the
// deployed backend's origin, e.g. https://famous-hardware-api.vercel.app/api
const baseURL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL,
  withCredentials: true // sends/receives the httpOnly auth cookie
});

export default api;
