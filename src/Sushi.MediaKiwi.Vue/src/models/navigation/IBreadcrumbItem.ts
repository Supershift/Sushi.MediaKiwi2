/** Represents a single item in the breadcrumbs. */
export interface IBreadcrumbItem {
    /** Title to display. */
    title: string;  
    /** Determines if the item is diabled */
    disabled: boolean;
    /** Determens if the item must be bolded. */
    bold: boolean;
    /** Path, relative to the application's root. Not provided by API, but needs to be calculated based on item's hierarchy. */
    path: string;
  }