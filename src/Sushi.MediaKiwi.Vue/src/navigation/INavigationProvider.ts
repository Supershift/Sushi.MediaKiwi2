import { NavigationItem, NavigationTree, Section } from "@/models/navigation";

export interface INavigationProvider {    
    GetTreeAsync() : Promise<NavigationTree>;
}
