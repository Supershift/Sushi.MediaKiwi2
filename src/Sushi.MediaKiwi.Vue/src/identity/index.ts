import { AccountInfo, InteractionStatus, PublicClientApplication } from "@azure/msal-browser";

export const identity = <
  {
    msalInstance: PublicClientApplication;
    /** Scopes for id token to be used at MS Identity Platform endpoints. */
    scopes: Array<string>;
  }
>{
  scopes: ["api://7cd2eddb-b79e-4e04-ac24-0011821ccb8e/access_via_approle_assignments"],
};
