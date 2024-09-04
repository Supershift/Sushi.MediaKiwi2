import { NavigationItem, NavigationTree, Section } from "@/models/navigation";
import { INavigationProvider } from "./INavigationProvider";

export type SimpleNavigationItem = {
    /** Unique identifier for this item. */
    id: string;
    /** Label to display. */
    name: string;
    /** If defined, name of the url parameter expected by VueRouter for this item */
    parameterName?: string;
    /** Children of this item in the navigation hierarchy */
    children: SimpleNavigationItem[];
    /** Prepend icon - if available will place an icon inform of the Navigation Item */
    icon?: string;
    /** If defined, key of the component's module */
    componentKey?: string;
    /** If not empty, access to this screen is restricted to these roles. */
    roles?: string[];
}

export type SimpleSection = {
    id: string;
    name: string;
    icon?: string;
    /** If not empty, access to this screen is restricted to these roles. */
    roles?: string[];
    /** Tooltip text */
    tooltip?: string;

    items: SimpleNavigationItem[];
}

export class JsonNavigationProvider implements INavigationProvider {
    private navigationTree: NavigationTree = new NavigationTree([]);    
    
    async GetTreeAsync(): Promise<NavigationTree> {
        return this.navigationTree;
    }

    SetTree(sections: SimpleSection[]) {
        // convert provided sections to tree
        const resultItems: Section[] = [];
        sections.forEach(section => {
            const resultItem: Section = {
                id: section.id,
                name: section.name,
                icon: section.icon,
                roles: section.roles,
                tooltip: section.tooltip,
                items: []
            }

            resultItem.items = this.convertNavigationItem(section.items, resultItem);

            resultItems.push(resultItem);
        });

        this.navigationTree = new NavigationTree(resultItems);
    }

    private convertNavigationItem(items: SimpleNavigationItem[], section: Section, parent?: NavigationItem): NavigationItem[] {
        const result: NavigationItem[] = [];
        items.forEach(item => {
            const resultItem: NavigationItem = {
                id: item.id,
                name: item.name,
                parameterName: item.parameterName,
                icon: item.icon,
                componentKey: item.componentKey,
                roles: item.roles,
                section: section,
                parent: parent,
                children: []
            };
            resultItem.children = this.convertNavigationItem(item.children, section, resultItem);
            result.push(resultItem);
        });
        return result;
    }
}

