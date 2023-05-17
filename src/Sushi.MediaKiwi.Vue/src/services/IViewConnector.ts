import type { ListResult, Sorting } from "@/models";
import { View } from "@/models";
import { Paging } from "@/models/api/Paging";

export interface IViewConnector {
  CreateView(request: View): Promise<View>;
  DeleteView(id: number): Promise<void>;
  GetViews(sectionId?: number, paging?: Paging, sorting?: Sorting): Promise<ListResult<View>>;
  GetView(id: number): Promise<View | undefined>;
  UpdateView(id: number, request: View): Promise<View>;
}
