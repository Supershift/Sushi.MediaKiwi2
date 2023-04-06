import { ListResult } from "@/models";
import { View } from "@/models";

export interface IViewConnector {
  GetViews(): Promise<ListResult<View>>;
  GetView(id: number): Promise<View | undefined>;
  UpdateView(id: number, request: View): Promise<View>;
  CreateView(request: View): Promise<View>;
}
