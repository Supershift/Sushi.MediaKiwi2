import type { ListResult, Sorting } from "@/models";
import { ViewDto } from "@/models";
import { Paging } from "@/models/api/Paging";

export interface IViewConnector {
  CreateView(id: string, request: ViewDto): Promise<ViewDto>;
  DeleteView(id: string): Promise<void>;
  GetViews(paging?: Paging, sorting?: Sorting): Promise<ListResult<ViewDto>>;
  GetView(id: string): Promise<ViewDto | undefined>;
  UpdateView(id: string, request: ViewDto): Promise<ViewDto>;
}
