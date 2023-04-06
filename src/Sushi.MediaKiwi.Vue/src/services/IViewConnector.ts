import { ListResult } from "@/models";
import { View } from "@/models";

export interface IViewConnector {
  CreateView(request: View): Promise<View>;
  DeleteView(id: number): Promise<void>;
  GetViews(): Promise<ListResult<View>>;
  GetView(id: number): Promise<View | undefined>;
  UpdateView(id: number, request: View): Promise<View>;
}
