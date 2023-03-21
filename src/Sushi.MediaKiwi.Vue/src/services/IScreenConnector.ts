import { ListResult } from "@/models";
import { IScreen } from "@/models";

export interface IScreenConnector {
  GetScreens(): Promise<ListResult<IScreen>>;
}
