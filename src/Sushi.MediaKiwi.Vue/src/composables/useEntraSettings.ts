import { MediakiwiVueOptions } from "@/models";
import { Api } from "@/services";
import { createPublicAxiosClient } from "@/services/axios/createAxiosClient";

export function useEntraSettings(apiBaseUrl: string) {
  const mediaKiwiApi = new Api<any>();
  mediaKiwiApi.instance = createPublicAxiosClient(apiBaseUrl.replace("mediakiwi/api", ""));

  async function getEntraSettings() {
    const entraSettings = await mediaKiwiApi.mediakiwi.apiIdentityproviderEntraList();

    const authority = `${entraSettings.data.instance}${entraSettings.data.tenantId}`;

    return { ...entraSettings.data, authority };
  }

  async function fillEntraSettings(options: MediakiwiVueOptions): Promise<MediakiwiVueOptions> {
    const entraSettings = await getEntraSettings();

    var clientId = entraSettings.clientId ?? options.msalConfig?.auth?.clientId ?? "useEntraSettings: clientId not configured";

    return {
      ...options,
      msalConfig: {
        auth: {
          clientId: clientId,
          authority: entraSettings.authority ?? options.msalConfig?.auth?.authority ?? "useEntraSettings: authority not configured",
          redirectUri: options.msalConfig?.auth?.redirectUri ?? "/loginRedirect",
          postLogoutRedirectUri: options.msalConfig?.auth?.postLogoutRedirectUri ?? "/signIn",
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
