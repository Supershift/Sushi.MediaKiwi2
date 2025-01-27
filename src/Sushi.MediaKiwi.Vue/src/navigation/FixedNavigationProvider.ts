import { NavigationItem, NavigationTree, Section } from "@/models/navigation";
import { INavigationProvider } from "./INavigationProvider";

export class FixedNavigationProvider implements INavigationProvider{    
    private navigationTree: NavigationTree;
    
    constructor(navigationTree : NavigationTree){        
        this.navigationTree = navigationTree;
    }
    async GetTreeAsync(): Promise<NavigationTree> {
        return this.navigationTree;
    }

    
}