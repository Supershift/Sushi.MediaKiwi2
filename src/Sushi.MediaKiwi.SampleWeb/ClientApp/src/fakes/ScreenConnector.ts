import { type IScreenConnector, ListResult, IScreen } from "@supershift/mediakiwi-vue";
import { screens } from "./repository";

export class ScreenConnector implements IScreenConnector {
  GetScreens(): Promise<ListResult<IScreen>> {
    return new Promise((resolve, reject) => {
      const result = new ListResult<IScreen>();
      result.result = screens;
      result.totalCount = screens.length;
      result.pageCount = 0;
      resolve(result);
    });
  }
}
