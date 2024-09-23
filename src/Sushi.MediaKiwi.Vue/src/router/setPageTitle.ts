import { NavigationItem } from "@/models/navigation";
import { type RouteLocationNormalized, type Router } from "vue-router";

function getParentName(navigationItem: NavigationItem): string {
  if (navigationItem.parent) {
    return getParentName(navigationItem.parent);
  }

  return navigationItem.name;
}

/**
 * Add a beforeEach method to set the page title
 * Based on the MediaKiwi Vue Options Title, Section and (Parent)Page Name
 *
 *
 */
export function setPageTitle(router: Router): void {
  router.beforeEach((to: RouteLocationNormalized) => {
    // Set the Base Title
    // Example: MediaKiwi 2.0

    if (to.meta?.navigationItem) {
      // Get the navigation item from the meta of the route
      const navigationItem = <NavigationItem>to.meta?.navigationItem;

      if (navigationItem) {
        let pageTitle = navigationItem.name;

        // Prepend the section name to the title
        // Example: Admin - MediaKiwi 2.0
        if (navigationItem.section.name) {
          pageTitle = `${navigationItem.section.name} - ${pageTitle}`;
        }

        // Prepend the navigation item name to the title
        // Example: Views - Admin - MediaKiwi 2.0
        const parentName = getParentName(navigationItem);
        if (parentName) {
          pageTitle = `${parentName} - ${pageTitle}`;
        }

        // Set the document title
        if (pageTitle) {
          document.title = pageTitle;
        }
      }
    } else if (to.meta?.title) {
      // Set the document title
      document.title = to.meta.title.toString();
    }
  });
}
