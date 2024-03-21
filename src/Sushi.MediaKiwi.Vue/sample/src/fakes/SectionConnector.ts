import { type ISectionConnector, ListResult, Section } from "@/framework";
import { sections } from "./repository";

export class SectionConnector implements ISectionConnector {
  CreateSection(request: Section): Promise<Section> {
    throw new Error("Method not implemented.");
  }
  DeleteSection(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
  GetSection(id: number): Promise<Section | undefined> {
    throw new Error("Method not implemented.");
  }
  UpdateSection(id: number, request: Section): Promise<Section> {
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
