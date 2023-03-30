import type { NavigationItem, Section } from "@/models";
import { useMediakiwiStore } from "@/stores";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { type Router } from "vue-router";

/*
  Returns the routing functions using the store and routers of mediakiwi
*/
export default function () {
  //const navigationStore = useNavigationStore();
  const mediakiwiStore = useMediakiwiStore();
  type NavigationTypeGuard = NavigationItem | Section;

  const navigateTo = (router: Router, item: NavigationTypeGuard): void => {
    // Since we are injecting the router via the store it is already up and running when we initiate
    if (checkTypeGuardIsSection(item)) {
      // if it's the section, then we seach the sections
      const sectionName = "/" + mediakiwiStore.mediakiwiSections.find((x) => x.name === item.name)?.name;
      // called to send user to target screen
      router.push(sectionName);
    } else {
      // if its navigationItem then we push to nav item's path
      const navigationItem = item as NavigationItem;
      if (navigationItem) {
        // called to send user to target screen
        router.push({ name: navigationItem.id.toString() });
      }
    }
  };
  // checks Type of ISection
  const checkTypeGuardIsSection = (toBeDetermined: NavigationTypeGuard): boolean => {
    if ((toBeDetermined as NavigationItem).path) {
      return false;
    }
    return true;
  };

  return {
    navigateTo,
  };
}
