import { EntraSettings } from "@/models";

export interface IIdentityProviderConnector {
  GetEntraSettings(): Promise<EntraSettings>;
}
