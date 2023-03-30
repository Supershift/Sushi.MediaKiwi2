import type { Role } from "@/models";
import { injectable, inject } from "tsyringe";
import type { IMediakiwiAxiosInstance } from "@/services/interceptors/MediakiwiAxiosInstance";
import type ListResult from "@/models/api/ListResult";
import { IRoleConnector } from "./IRoleConnector";

@injectable()
export class RoleConnector implements IRoleConnector {
  constructor(@inject("IMediakiwiAxiosInstance") private axios: IMediakiwiAxiosInstance) {}

  async GetRoles() {
    const response = await this.axios.get<ListResult<Role>>("/roles");
    return response.data;
  }
}
