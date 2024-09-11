import axios from "axios";
import store from "./store";
import router from "./router";

const axiosClient = axios.create({
  baseURL: `/api`,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = store.state.user?.token || sessionStorage.getItem("TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        sessionStorage.removeItem("TOKEN");
        store.dispatch("logout");
        router.push({ name: "Login" });
      } else if (status === 404) {
        router.push({ name: "NotFound" });
      } else {
        console.error(
          "API Error:",
          error.response.data.message || error.message
        );
      }
    } else {
      console.error("Network error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
