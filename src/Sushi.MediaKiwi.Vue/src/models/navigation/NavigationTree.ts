import { NavigationItem } from "./NavigationItem";
import { Section } from "./Section";

export class NavigationTree {
    constructor(sections: Section[]) {
        this.sections = sections;
        
        // 1. are all section ids unique?
        const sectionIds: string[] = [];
        sections.forEach((section) => {
            if (sectionIds.includes(section.id)) {
                throw new Error(`Section id ${section.id} is not unique`);
            }
            sectionIds.push(section.id);
        });
        
        // 2. add navigation items to dictionary, which also checks if the id is unique                
        sections.forEach((section) => {
            this.addNavigationItem(section.items);
        });
    }

    public sections: Section[];
    public getNavigationItem(id: string): NavigationItem | undefined {
        return this.navigationItems[id];
    }
    public getAllNavigationItems(): NavigationItem[] {
        return Object.values(this.navigationItems);
    }

    private navigationItems: { [id: string] : NavigationItem; } = {};

    private addNavigationItem(items: NavigationItem[]) {
        items.forEach(item => {
            // process children
            this.addNavigationItem(item.children);
            // add to dictionary
            if (this.navigationItems[item.id]) {
                throw new Error(`Navigation item id ${item.id} is not unique`);
            }
            this.navigationItems[item.id] = item;
        })
    }

}