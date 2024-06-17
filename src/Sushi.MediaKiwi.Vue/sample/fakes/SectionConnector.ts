import { ListResult, Section } from "@/models";
import { type ISectionConnector } from "@/services";
import { sections } from "./repository";

export class SectionConnector implements ISectionConnector {
  CreateSection(id: string, request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  DeleteSection(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  GetSection(id: string): Promise<Section | undefined> {
    throw new Error("Method not implemented.");
  }
  UpdateSection(id: string, request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  GetSections(): Promise<ListResult<Section>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<Section>();
      result.result = sections;
      result.totalCount = sections.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
