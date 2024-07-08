import { EntraSettings } from "@/models";
import { injectable, inject } from "tsyringe";
import type { AxiosInstance } from "axios";
import { IIdentityProviderConnector } from "./interfaces/IIdentityProviderConnector";

@injectable()
export class IdentityProviderConnector implements IIdentityProviderConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async GetEntraSettings(): Promise<EntraSettings> {
    const response = await this.axios.get<EntraSettings>("/identityprovider/entra");
    return response.data;
  }
}
