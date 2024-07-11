import { MediakiwiVueOptions } from "@/models";
import { createPublicAxiosClient } from "@/services/axios/createAxiosClient";
import { IdentityProviderConnector } from "@/services/IdentityProviderConnector";

export function useEntraSettings(apiBaseUrl: string = import.meta.env.VITE_APP_MEDIAKIWI_APIBASEURL) {
  const axiosClient = createPublicAxiosClient(apiBaseUrl);

  const identityProviderConnector = new IdentityProviderConnector(axiosClient);

  async function getEntraSettings() {
    const entraSettings = await identityProviderConnector.GetEntraSettings();

    entraSettings.authority = `${entraSettings.instance}${entraSettings.tenantId}`;

    return entraSettings;
  }

  async function fillEntraSettings(options: MediakiwiVueOptions): Promise<MediakiwiVueOptions> {
    const entraSettings = await getEntraSettings();

    var clientId = entraSettings.clientId ?? import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_CLIENTID;

    return {
      ...options,
      msalConfig: {
        auth: {
          clientId: clientId,
          authority: entraSettings.authority ?? import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_AUTHORITY,
          redirectUri: import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_REDIRECTURI,
          postLogoutRedirectUri: import.meta.env.VITE_APP_MEDIAKIWI_MSALCONFIG_AUTH_POSTLOGOUTREDIRECTURI,
        },
      },
      identity: { scopes: [`api://${clientId}/access_via_approle_assignments`] },
    };
  }

  return {
    getEntraSettings,
    fillEntraSettings,
  };
}
