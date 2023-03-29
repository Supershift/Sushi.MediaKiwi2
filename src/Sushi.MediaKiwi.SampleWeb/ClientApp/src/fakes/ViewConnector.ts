import { type IViewConnector, ListResult, View } from "@supershift/mediakiwi-vue";
import { views } from "./repository";

export class ViewConnector implements IViewConnector {
  GetScreens(): Promise<ListResult<View>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<View>();
      result.result = views;
      result.totalCount = views.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
