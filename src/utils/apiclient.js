import axios from "axios";

const AUTH_TOKEN_KEY = "token";
const UNAUTHORIZED_STATUS_CODE = 401;

axios.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error("Error setting Authorization header:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response: { status } = {} } = error;
    if (status === UNAUTHORIZED_STATUS_CODE) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.location.href = "/login";
    }
    console.error("Error response:", error);
    return Promise.reject(error);
  }
);

export default axios;
