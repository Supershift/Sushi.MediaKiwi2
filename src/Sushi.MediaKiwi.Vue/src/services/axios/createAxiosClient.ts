import axios, { AxiosInstance } from "axios";
import { addAuthentication } from "./addAuthentication";
import { addErrorHandler } from "./addErrorHandler";
import { addApiConnectionWatch } from "./addApiConnectionWatch";
import { addParamSerializer } from "./addParamSerializer";

/** Creates an Axios client with the specified base url, application/json as content type and authorization header added when an active account is found. */
export function createAxiosClient(baseUrl: string): AxiosInstance {
  const result = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add the authentication interceptor
  result.interceptors.request.use(addAuthentication);

  // Add the connection watch interceptor
  result.interceptors.response.use(addApiConnectionWatch);

  // Add the params serializer
  addParamSerializer(result);

  // Add the problem details interceptor
  addErrorHandler(result);

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
