/** Represents a single item in the breadcrumbs. */
export interface IBreadcrumbItem {
    /** Denotes the target route of the link. */
    to: string;  
    /** Exactly match the link. Without this, ‘/’ will match every route. */
    exact?: boolean;  
    /** Title to display. */
    title: string;  
    /** Determines if the item is diabled */
    disabled?: boolean;
    /** Determens if the item must be bolded. */
    bold?: boolean;
    /** Path, relative to the application's root. Not provided by API, but needs to be calculated based on item's hierarchy. */
    href: string;
  }