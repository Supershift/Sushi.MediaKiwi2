import { NavigationItemDto, SectionDto, ViewDto } from "@/models";
import { INavigationProvider } from "./INavigationProvider";
import { container } from "tsyringe";
import { INavigationConnector, ISectionConnector, IViewConnector } from "@/services";
import { noPageSize } from "@/constants";
import { NavigationItem, NavigationTree, Section } from "@/models/navigation";

export class ApiNavigationProvider implements INavigationProvider {
    async GetTreeAsync(): Promise<NavigationTree> {
        // call api to get all dto objects
        const sectionDtos = await this.GetSectionsAsync();
        const navigationItemDtos = await this.GetNavigationItemsAsync();
        const views = await this.GetViewsAsync();

        // convert to domain objects
        const sections : Section[] = []
        
        // sort sections by sortOrder
        sectionDtos.sort((a, b) => a.sortOrder - b.sortOrder);

        // convert sections and navigation items
        sectionDtos.forEach(sectionDto => {
            const section : Section = { 
                id: sectionDto.id, 
                name: sectionDto.name, 
                icon: sectionDto.icon, 
                roles: sectionDto.roles,
                items: [] };
            sections.push(section);

            // get all navigation items for section
            const sectionNavigationItems = navigationItemDtos.filter(item => item.sectionId === sectionDto.id);

            // recursively add navigation items
            function convertNavigationItems(items : NavigationItemDto[]) : NavigationItem[] {
                const result : NavigationItem[] = [];
                items.forEach(item => {
                    // get view for item
                    const view : ViewDto | undefined = views.find(v => v.id === item.viewId);
                    
                    // create item
                    const navigationItem : NavigationItem = { 
                        id: item.id, 
                        name: item.name,                         
                        icon: item.icon, 
                        section: section,
                        roles: undefined,
                        componentKey: view?.componentKey,
                        parameterName: view?.parameterName,
                        children: [] };                    
                    result.push(navigationItem);

                    // get children
                    const children = sectionNavigationItems.filter(child => child.parentNavigationItemId === item.id);
                    children.sort((a, b) => a.sortOrder - b.sortOrder);
                    navigationItem.children = convertNavigationItems(children);
                });
                return result;
            }

            // get all root navigation items, sorted by sortOrder
            const rootNavigationItems = sectionNavigationItems.filter(item => !item.parentNavigationItemId);
            rootNavigationItems.sort((a, b) => a.sortOrder - b.sortOrder);

            section.items = convertNavigationItems(rootNavigationItems);
        });

        // create tree
        return new NavigationTree(sections);
    }
    
    async GetNavigationItemsAsync(): Promise<NavigationItemDto[]> {
        const connector = container.resolve<INavigationConnector>("INavigationConnector");
        const navigationItems = await connector.GetNavigationItems(undefined, { pageSize: noPageSize });
        return navigationItems.result;
    }
    async GetSectionsAsync(): Promise<SectionDto[]> {
        const connector = container.resolve<ISectionConnector>("ISectionConnector");
        const sections = await connector.GetSections({ pageSize: noPageSize });
        return sections.result;
    }

    async GetViewsAsync(): Promise<ViewDto[]> {
        const connector = container.resolve<IViewConnector>("IViewConnector");
        const views = await connector.GetViews({ pageSize: noPageSize });
        return views.result;
    }
}