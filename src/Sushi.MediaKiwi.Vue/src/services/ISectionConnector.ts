import { ListResult } from "@/models";
import { ISectionResponse } from "@/models/responses";

export interface ISectionConnector {
  GetSections(): Promise<ListResult<ISectionResponse>>;
}
