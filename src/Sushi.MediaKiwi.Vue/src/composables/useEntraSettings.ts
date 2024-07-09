import { EntraSettings } from "@/models";
import { createPublicAxiosClient } from "@/services/axios/createAxiosClient";
import { IdentityProviderConnector } from "@/services/IdentityProviderConnector";

export function useEntraSettings(apiBaseUrl: string = import.meta.env.VITE_APP_MEDIAKIWI_APIBASEURL) {
  // Create the public axios client
  const axiosClient = createPublicAxiosClient(apiBaseUrl);

  // Create the connector with the axios client
  const identityProviderConnector = new IdentityProviderConnector(axiosClient);

  async function getEntraSettings() {
    // Get the Entra settings
    const entraSettings = await identityProviderConnector.GetEntraSettings();

    // Set the authority
    entraSettings.authority = `${entraSettings.instance}${entraSettings.tenantId}`;

    // Return the Entra settings
    return entraSettings;
  }

  return {
    getEntraSettings,
  };
}
