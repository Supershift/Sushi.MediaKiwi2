export type MediaKiwiSection = {
  testVariable: string;
  useFakes: boolean;
  useLocalApi: boolean;
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
