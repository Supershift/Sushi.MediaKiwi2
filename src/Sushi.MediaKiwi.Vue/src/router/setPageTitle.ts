import { MediakiwiVueOptions, NavigationItem } from "@/models";
import { useMediakiwiStore } from "@/stores";
import { type RouteLocationNormalized, type Router } from "vue-router";

/**
 * Add a beforeEach method to set the page title
 * Based on the MediaKiwi Vue Options Title, Section and (Parent)Page Name
 *
 *
 */
export function setPageTitle(router: Router, options?: MediakiwiVueOptions): void {
  // Get the provided title from the options
  document.title = <string>options?.title;

  router.beforeEach((to: RouteLocationNormalized) => {
    // Set the Base Title
    // Example: MediaKiwi 2.0
    let pageTitle = <string>options?.title;

    if (to.meta?.navigationItem) {
      // Get the navigation item from the meta of the route
      const navigationItem = <NavigationItem>to.meta?.navigationItem;

      if (navigationItem) {
        // Get the sections from the store
        const { sections, getParentName } = useMediakiwiStore();

        // Find the matching section
        const section = sections?.find((x) => x.id === navigationItem.sectionId);

        // Prepend the section name to the title
        // Example: Admin - MediaKiwi 2.0
        if (section?.name) {
          pageTitle = `${section.name} - ${pageTitle}`;
        }

        // Prepend the navigation item name to the title
        // Example: Views - Admin - MediaKiwi 2.0
        const parentName = getParentName(navigationItem);
        if (parentName) {
          pageTitle = `${parentName} - ${pageTitle}`;
        }
      }
    }

    // Set the document title
    document.title = pageTitle;
  });
}
