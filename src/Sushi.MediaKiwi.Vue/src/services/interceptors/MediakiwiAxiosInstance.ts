import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { identity } from "@/identity";
import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { container } from "tsyringe";
import { IMediakiwiVueOptions } from "@models/options";

export interface IMediakiwiAxiosInstance extends AxiosInstance {}

/** Configures Axios to call the Mediakiwi API */
export async function configureMediakiwiAxios(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
  const options = container.resolve<IMediakiwiVueOptions>("MediakiwiOptions");
  config.baseURL = options.apiBaseUrl;
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
}

// Interceptor for handling calls to the API
const mediaKiwiAxiosInstance = <IMediakiwiAxiosInstance>axios.create();
mediaKiwiAxiosInstance.interceptors.request.use(configureMediakiwiAxios);

export default mediaKiwiAxiosInstance;
