import { ListResult, Paging } from "@/models";
import { Section } from "@/models";

export interface ISectionConnector {
  CreateSection(id: string, request: Section): Promise<Section>;
  DeleteSection(id: string): Promise<void>;
  GetSections(paging?: Paging): Promise<ListResult<Section>>;
  GetSection(id: string): Promise<Section | undefined>;
  UpdateSection(id: string, request: Section): Promise<Section>;
}
