import { type IScreenConnector, ListResult, IScreenResponse } from "@supershift/mediakiwi-vue";
import { screens } from "./repository";

export class ScreenConnector implements IScreenConnector {
  GetScreens(): Promise<ListResult<IScreenResponse>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<IScreenResponse>();
      result.result = screens;
      result.totalCount = screens.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
