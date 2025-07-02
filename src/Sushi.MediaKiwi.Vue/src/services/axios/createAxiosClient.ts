import axios, { AxiosInstance } from "axios";
import { addAuthentication } from "./addAuthentication";
import { registerInterceptor } from "./interceptor";
import { MediakiwiVueOptions } from "@/models";

/** Creates an Axios client with the specified base url, application/json as content type and authorization header added when an active account is found. */
export function createAxiosClient(baseUrl: string): AxiosInstance;
export function createAxiosClient(options: MediakiwiVueOptions): AxiosInstance;
export function createAxiosClient(value: string | MediakiwiVueOptions): AxiosInstance {
  let mediakiwiOptions: MediakiwiVueOptions | undefined;

  const baseUrl = typeof value === "string" ? value : value?.apiBaseUrl;

  // If the value is an object, we assume it's a MediakiwiVueOptions object
  if (value instanceof Object) {
    mediakiwiOptions = value;
  }

  const result = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add the authentication interceptor
  result.interceptors.request.use(addAuthentication);

  // Add the problem details interceptor
  registerInterceptor(result);

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
