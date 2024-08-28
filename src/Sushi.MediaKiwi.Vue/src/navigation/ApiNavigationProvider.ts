import { View, NavigationItem, Section } from "@/models";
import { INavigationProvider } from "./INavigationProvider";
import { container } from "tsyringe";
import { INavigationConnector, ISectionConnector, IViewConnector } from "@/services";
import { noPageSize } from "@/constants";

export class ApiNavigationProvider implements INavigationProvider {
    async GetViewsAsync(): Promise<View[]> {
        const connector = container.resolve<IViewConnector>("IViewConnector");
        const views = await connector.GetViews({ pageSize: noPageSize });
        return views.result;
    }
    async GetNavigationItemsAsync(): Promise<NavigationItem[]> {
        const connector = container.resolve<INavigationConnector>("INavigationConnector");
        const navigationItems = await connector.GetNavigationItems(undefined, { pageSize: noPageSize });
        return navigationItems.result;
    }
    async GetSectionsAsync(): Promise<Section[]> {
        const connector = container.resolve<ISectionConnector>("ISectionConnector");
        const sections = await connector.GetSections({ pageSize: noPageSize });
        return sections.result;
    }
}