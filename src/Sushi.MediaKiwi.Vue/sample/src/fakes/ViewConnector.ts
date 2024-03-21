import { type IViewConnector, ListResult, View } from "@mediakiwi/";
import { views } from "./repository";

export class ViewConnector implements IViewConnector {
  CreateView(id: string, request: View): Promise<View> {
    throw new Error("Method not implemented.");
  }
  DeleteView(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  GetView(id: string): Promise<View | undefined> {
    throw new Error("Method not implemented.");
  }
  UpdateView(id: string, request: View): Promise<View> {
    throw new Error("Method not implemented.");
  }
  GetViews(): Promise<ListResult<View>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<View>();
      result.result = views;
      result.totalCount = views.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
