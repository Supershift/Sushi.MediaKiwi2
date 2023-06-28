import type { Role } from "@/models";
import { injectable, inject } from "tsyringe";
import type { AxiosInstance } from "axios";
import type ListResult from "@/models/api/ListResult";
import { IRoleConnector } from "./IRoleConnector";

@injectable()
export class RoleConnector implements IRoleConnector {
  constructor(@inject("MediakiwiAxiosInstance") private axios: AxiosInstance) {}

  async GetRoles() {
    const response = await this.axios.get<ListResult<Role>>("/roles");
    return response.data;
  }
}
