import { type ISectionConnector, ListResult, ISectionResponse } from "@supershift/mediakiwi-vue";
import { sections } from "./repository";

export class SectionConnector implements ISectionConnector {
  GetSections(): Promise<ListResult<ISectionResponse>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<ISectionResponse>();
      result.result = sections;
      result.totalCount = sections.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
