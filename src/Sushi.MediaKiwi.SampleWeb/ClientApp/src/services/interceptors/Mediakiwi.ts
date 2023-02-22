import axios, { type InternalAxiosRequestConfig } from "axios";

const CancelToken = axios.CancelToken;

// Interceptor for handling calls to the API
let mediaKiwiAxiosInstance = axios.create();
mediaKiwiAxiosInstance.interceptors.request.use((config): any => {
  // config.withCredentials = true;// TODO: Fix this so we use the base URL and base route
  config.baseURL = `https://localhost:7223/mediakiwi/api`,// TODO: Add Authentication
  config.headers["Content-Type"] = "application/json";// eventually we would want to use credentials for the calls
  config.headers["Access-Control-Allow-Origin"] = "*";
  // if(localStorage.getItem('profile')) {
  //   config.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')?? "")?.token }`; //TODO: resolve auth method down the line
  // }
  return config;
});

export default mediaKiwiAxiosInstance;
