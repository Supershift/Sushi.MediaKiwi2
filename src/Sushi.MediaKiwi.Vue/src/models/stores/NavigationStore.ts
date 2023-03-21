import { type IBreadcrumb } from "../breadcrumb";
import { type INavigationItem } from "../navigation";
import { type ISection } from "../section";

export interface INavigationState {
    navigationItems: Array<INavigationItem>;
    sectionItems: Array<ISection>;
    breadcrumbItems: Array<IBreadcrumb>;
    currentSection: ISection | undefined;
    drawer: boolean;
}
export class NavigationState implements INavigationState {
    navigationItems: Array<INavigationItem>;
    sectionItems: Array<ISection>;
    breadcrumbItems: Array<IBreadcrumb>;
    currentSection: ISection | undefined;
    drawer: boolean;

    constructor( 
        navigationItems: Array<INavigationItem>,
        sectionItems: Array<ISection>,
        breadcrumbItems: Array<IBreadcrumb>,
        drawer: boolean,
        currentSection?: ISection,
    ) { 
        this.navigationItems = navigationItems;
        this.sectionItems = sectionItems;
        this.breadcrumbItems = breadcrumbItems; 
        this.drawer = drawer;
        if (currentSection) {
            this.currentSection = currentSection
        }       
    }
}