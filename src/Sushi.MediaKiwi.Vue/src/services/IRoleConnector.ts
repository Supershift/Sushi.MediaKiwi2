import { ListResult } from "@/models";
import { Role } from "@/models";

export interface IRoleConnector {
  GetRoles(): Promise<ListResult<Role>>;
}
