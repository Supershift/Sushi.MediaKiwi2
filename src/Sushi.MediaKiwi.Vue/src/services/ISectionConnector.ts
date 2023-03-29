import { ListResult } from "@/models";
import { Section } from "@/models";

export interface ISectionConnector {
  GetSections(): Promise<ListResult<Section>>;
}
