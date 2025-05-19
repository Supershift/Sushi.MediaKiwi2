import axios, { AxiosInstance } from "axios";
import { addAuthentication } from "./addAuthentication";
import { registerInterceptor } from "./interceptor";
import { MediakiwiVueOptions } from "@/models";
import { addAbortController, clearAbortController } from "./addAbortController";
import { inject } from "vue";

/** Creates an Axios client with the specified base url, application/json as content type and authorization header added when an active account is found. */
export function createAxiosClient(baseUrl: string): AxiosInstance {
  // Inject the MediakiwiVueOptions to get the axiosClient options
  const mediakiwiOptions = inject<MediakiwiVueOptions>("mediakiwi");

  const result = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Add the authentication interceptor
  result.interceptors.request.use(addAuthentication);

  // Add the abort controller interceptor
  result.interceptors.request.use(mediakiwiOptions?.axiosClient?.interceptors?.addAbortController ?? addAbortController);
  result.interceptors.response.use(mediakiwiOptions?.axiosClient?.interceptors?.clearAbortController ?? clearAbortController);

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
