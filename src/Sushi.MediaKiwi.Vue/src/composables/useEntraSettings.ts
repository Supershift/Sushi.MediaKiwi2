import { MediakiwiVueOptions } from "@/models";
import { createPublicAxiosClient } from "@/services/axios/createAxiosClient";
import { IdentityProviderConnector } from "@/services/IdentityProviderConnector";

export function useEntraSettings(apiBaseUrl: string = "useEntraSettings: apiBaseUrl not configured") {
  const axiosClient = createPublicAxiosClient(apiBaseUrl);

  const identityProviderConnector = new IdentityProviderConnector(axiosClient);

  async function getEntraSettings() {
    const entraSettings = await identityProviderConnector.GetEntraSettings();

    entraSettings.authority = `${entraSettings.instance}${entraSettings.tenantId}`;

    return entraSettings;
  }

  async function fillEntraSettings(options: MediakiwiVueOptions): Promise<MediakiwiVueOptions> {
    const entraSettings = await getEntraSettings();

    var clientId = entraSettings.clientId ?? options.msalConfig?.auth.clientId ?? "useEntraSettings: clientId not configured";

    return {
      ...options,
      msalConfig: {
        auth: {
          clientId: clientId,
          authority: entraSettings.authority ?? options.msalConfig?.auth.authority ?? "useEntraSettings: authority not configured",
          redirectUri: options.msalConfig?.auth.redirectUri ?? "/loginRedirect",
          postLogoutRedirectUri: options.msalConfig?.auth.postLogoutRedirectUri ?? "/signIn",
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
