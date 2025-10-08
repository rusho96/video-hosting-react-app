
import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/AuthSlice";
const URL = import.meta.env.VITE_APP_URL
console.log(URL)
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL:URL,
  
  withCredentials:tuue
})
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      
      if (originalRequest.url.includes("/user/refresh")) {
        store.dispatch(logout());
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        await api.get("/user/refresh"); 
        return api(originalRequest); 
      } catch (err) {
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
