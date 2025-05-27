import { NavigationTree } from "@/models/navigation";

export interface INavigationProvider {
  GetTreeAsync(): Promise<NavigationTree>;
}
