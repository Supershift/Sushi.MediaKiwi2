import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { inject } from "vue";
import { identity } from "@/identity";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export interface IMediakiwiAxiosInstance extends AxiosInstance {}
// Interceptor for handling calls to the API
const mediaKiwiAxiosInstance = <IMediakiwiAxiosInstance>axios.create();
mediaKiwiAxiosInstance.interceptors.request.use(async (config): Promise<InternalAxiosRequestConfig> => {
  config.baseURL = `https://localhost:7223/mediakiwi/api`;
  config.headers["Content-Type"] = "application/json";

  // add authorization header by acquiring token
  const msalInstance = identity.msalInstance;

  const account = msalInstance.getActiveAccount();
  if (account) {
    try {
      const response = await msalInstance.acquireTokenSilent({ scopes: identity.scopes });
      config.headers.Authorization = `bearer ${response.accessToken}`;
    } catch (e) {
      if (e instanceof InteractionRequiredAuthError) {
        // this will redirect the user away from the browser, so code after this will not be executed
        await msalInstance.acquireTokenRedirect({ scopes: identity.scopes });
      }
      throw e;
    }
  } else {
    console.warn("no active account found");
  }

  return config;
});

export default mediaKiwiAxiosInstance;
