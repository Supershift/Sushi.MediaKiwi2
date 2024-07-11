import axios, { AxiosInstance } from "axios";
import { addAuthentication } from "./addAuthentication";

/** Creates an Axios client with the specified base url, application/json as content type and authorization header added when an active account is found. */
export function createAxiosClient(baseUrl: string): AxiosInstance {
  const result = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  result.interceptors.request.use(addAuthentication);

  return result;
}

export function createPublicAxiosClient(baseUrl: string): AxiosInstance {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
