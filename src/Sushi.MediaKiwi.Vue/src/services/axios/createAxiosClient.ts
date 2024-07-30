import axios, { AxiosInstance } from "axios";
import { addAuthentication } from "./addAuthentication";
import { useAxiosExtensions } from "@/composables/useAxiosExtensions";

const { addProblemDetailsInterceptor } = useAxiosExtensions();

/** Creates an Axios client with the specified base url, application/json as content type and authorization header added when an active account is found. */
export function createAxiosClient(baseUrl: string): AxiosInstance {
  const result = axios.create({
    baseURL: baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  result.interceptors.request.use(addAuthentication);

  // Add the problem details interceptor
  addProblemDetailsInterceptor(result);

  return result;
}
