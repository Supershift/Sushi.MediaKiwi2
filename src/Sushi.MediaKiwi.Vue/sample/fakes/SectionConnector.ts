import { type ISectionConnector, ListResult, ISection } from "@/framework";
import { sections } from "./repository";

export class SectionConnector implements ISectionConnector {
  GetSections(): Promise<ListResult<ISection>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<ISection>();
      result.result = sections;
      result.totalCount = sections.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
