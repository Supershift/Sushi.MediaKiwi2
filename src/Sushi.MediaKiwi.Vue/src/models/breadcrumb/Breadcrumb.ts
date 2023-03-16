import IBreadcrumb  from "./IBreadcrumb";

export default class BreadCrumb implements IBreadcrumb {
    to: string;
    title: string; 
    href: string;
    /* Additional fields */
    exact?: boolean; 
    disabled?: boolean;
    bold?: boolean;
    /**
     *
     */
    constructor(to: string, title: string, href: string, exact?: boolean, disabled?: boolean, bold?: boolean) {
        this.to = to;
        this.title = title;
        this.href = href;
        if(exact !== undefined) {
            this.exact = exact;
        }
        if(disabled !== undefined) {
            this.disabled = disabled;
        }
        if(bold !== undefined) {
            this.bold = bold;
        }
    }
}