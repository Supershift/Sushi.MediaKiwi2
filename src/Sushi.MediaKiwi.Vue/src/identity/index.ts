import { PublicClientApplication } from "@azure/msal-browser";

export const identity = <
  {
    msalInstance: PublicClientApplication;
    /** Scopes for id token to be used at MS Identity Platform endpoints. */
    scopes: Array<string>;
  }
>{};
