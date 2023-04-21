import { ListResult, Paging } from "@/models";
import { Section } from "@/models";

export interface ISectionConnector {
  CreateSection(request: Section): Promise<Section>;
  DeleteSection(id: number): Promise<void>;
  GetSections(paging?: Paging): Promise<ListResult<Section>>;
  GetSection(id: number): Promise<Section | undefined>;
  UpdateSection(id: number, request: Section): Promise<Section>;
}
