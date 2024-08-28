import { View, NavigationItem, Section } from "@/models";

export interface INavigationProvider {
    GetViewsAsync(): Promise<View[]>;
    GetNavigationItemsAsync(): Promise<NavigationItem[]>;
    GetSectionsAsync(): Promise<Section[]>;
}
