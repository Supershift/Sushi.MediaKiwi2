import { ListResult } from "@/models";
import { IScreenResponse } from "@/models/responses";

export interface IScreenConnector {
  GetScreens(): Promise<ListResult<IScreenResponse>>;
}
