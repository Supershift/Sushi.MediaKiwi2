import { ListResult } from "@/models";
import { ISection } from "@/models";

export interface ISectionConnector {
  GetSections(): Promise<ListResult<ISection>>;
}
