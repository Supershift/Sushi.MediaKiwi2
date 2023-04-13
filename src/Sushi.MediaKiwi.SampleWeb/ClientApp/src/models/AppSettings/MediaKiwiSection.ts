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
  tennantId: string;
  cookie: string;
};
