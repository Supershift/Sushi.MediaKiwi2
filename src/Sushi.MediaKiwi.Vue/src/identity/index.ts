import { AccountInfo, InteractionRequiredAuthError, InteractionStatus, PublicClientApplication } from "@azure/msal-browser";

export const identity = <
  {
    msalInstance: PublicClientApplication;
    scopes: string[];
    getAccessToken: () => Promise<string | undefined>;
  }
>{
  getAccessToken: async (): Promise<string | undefined> => {
    let result: string | undefined = undefined;
    const account = identity.msalInstance.getActiveAccount();

    if (account) {
      try {
        const response = await identity.msalInstance.acquireTokenSilent({ scopes: identity.scopes });
        result = response.accessToken;
      } catch (e) {
        if (e instanceof InteractionRequiredAuthError) {
          // this will redirect the user away from the browser, so code after this will not be executed
          await identity.msalInstance.acquireTokenRedirect({ scopes: identity.scopes });
        }
      }
    }
    return result;
  },
};
