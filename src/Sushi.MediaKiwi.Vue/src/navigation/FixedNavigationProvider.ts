import { View, NavigationItem, Section } from "@/models";
import { INavigationProvider } from "./INavigationProvider";

export class FixedNavigationProvider implements INavigationProvider{
    private views: View[];
    private navigationItems: NavigationItem[];
    private sections: Section[];
    
    constructor(views : View[], navigationItems: NavigationItem[], sections: Section[]){
        this.views = views;
        this.navigationItems = navigationItems;
        this.sections = sections;
    }
    
    async GetViewsAsync(): Promise<View[]> {
        return this.views;
    }
    
    async GetNavigationItemsAsync(): Promise<NavigationItem[]> {
        return this.navigationItems;
    }
    
    async GetSectionsAsync(): Promise<Section[]> {
        return this.sections;
    }

}