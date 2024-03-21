import { type IViewConnector, ListResult, View } from "@/framework";
import { views } from "./repository";

export class ViewConnector implements IViewConnector {
  GetViews(): Promise<ListResult<View>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<View>();
      result.result = views;
      result.totalCount = views.length;
      result.pageCount = 0;
      resolve(result);
    });
  }

  GetView(id: number): Promise<View | undefined> {
    return new Promise((resolve, reject) => {
      const result = views.find((x) => x.id == id);
      resolve(result);
    });
  }
}
