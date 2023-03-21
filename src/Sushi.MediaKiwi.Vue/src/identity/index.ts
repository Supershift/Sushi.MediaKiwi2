import { PublicClientApplication } from "@azure/msal-browser";

export const identity = <
  {
    msalInstance: PublicClientApplication;
    /** Scopes for id token to be used at MS Identity Platform endpoints. */
    scopes: Array<string>;
  }
>{
  scopes: ["api://dbb29aa0-9a3d-49b2-95da-65f26854571e/access_as_user"],
};
