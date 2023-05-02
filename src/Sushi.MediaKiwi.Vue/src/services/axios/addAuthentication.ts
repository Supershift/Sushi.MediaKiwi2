import { InternalAxiosRequestConfig } from "axios";
import { identity } from "@/identity";
import { InteractionRequiredAuthError } from "@azure/msal-browser";

export async function addAuthentication(config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> {
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
