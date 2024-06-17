import type { ListResult, Sorting } from "@/models";
import { View } from "@/models";
import { Paging } from "@/models/api/Paging";

export interface IViewConnector {
  CreateView(id: string, request: View): Promise<View>;
  DeleteView(id: string): Promise<void>;
  GetViews(paging?: Paging, sorting?: Sorting): Promise<ListResult<View>>;
  GetView(id: string): Promise<View | undefined>;
  UpdateView(id: string, request: View): Promise<View>;
}
