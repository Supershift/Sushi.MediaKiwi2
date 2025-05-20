import { AxiosResponse, InternalAxiosRequestConfig } from "axios";

const pendingControllers = new Map<string, AbortController>();

// Generate a unique key for the request
const getRequestKey = (config: InternalAxiosRequestConfig) => {
  const { baseURL, method, url } = config;
  const key = [method, baseURL, url].join("__");
  return key;
};

export function addAbortController(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const requestKey = getRequestKey(config);

  // Cancel previous request if it exists
  const previousController = pendingControllers.get(requestKey);
  if (previousController) {
    previousController.abort(`Request cancelled due to a new request with the same key: ${requestKey}`); // Cancel the previous request
  }

  const controller = new AbortController();
  config.signal = controller.signal;

  // Save new controller
  pendingControllers.set(requestKey, controller);

  return config;
}

export function clearAbortController(response: AxiosResponse): AxiosResponse {
  const requestKey = getRequestKey(response.config);
  const controller = pendingControllers.get(requestKey);
  if (controller) {
    pendingControllers.delete(requestKey); // Remove the controller from the map
  }

  return response;
}
