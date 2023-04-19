export type MediaKiwiSection = {
  useFakes: boolean;
  apiBaseUrl: string;
  msalConfig: MsalConfig;
};

export type MsalConfig = {
  auth: Auth;
};

export type Auth = {
  clientId: string;
  authority: string;
  redirectUri: string;
  postLogoutRedirectUri: string;
};
