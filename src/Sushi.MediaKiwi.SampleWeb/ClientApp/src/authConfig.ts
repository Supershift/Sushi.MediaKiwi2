import { LogLevel, Configuration } from "@azure/msal-browser";

// Config object to be passed to mediakiwi's msal library
export const msalConfig: Configuration = {
  auth: {
    clientId: "7cd2eddb-b79e-4e04-ac24-0011821ccb8e",
    authority: "https://login.microsoftonline.com/95c90a04-5ea8-465e-ac3e-1aae3b29b0c9",
    redirectUri: "/loginRedirect", // Must be registered as a SPA redirectURI on your app registration
    postLogoutRedirectUri: "/signIn", // Must be registered as a SPA redirectURI on your app registration,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: "localStorage",
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
          default:
            return;
        }
      },
      logLevel: LogLevel.Verbose,
    },
  },
};
