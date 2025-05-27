import { NavigationTree } from "@/models/navigation";
import { INavigationProvider } from "./INavigationProvider";

export class FixedNavigationProvider implements INavigationProvider {
  constructor(readonly navigationTree: NavigationTree) {}

  async GetTreeAsync(): Promise<NavigationTree> {
    return this.navigationTree;
  }
}
