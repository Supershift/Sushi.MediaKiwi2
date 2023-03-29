import type { INavigationItem, ISection } from "@/models";
import { useMediakiwiStore } from "@/stores";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { type Router } from "vue-router";

/*
  Returns the routing functions using the store and routers of mediakiwi
*/
export default function () {
  //const navigationStore = useNavigationStore();
  const mediakiwiStore = useMediakiwiStore();
  type NavigationTypeGuard = INavigationItem | ISection;

  const navigateTo = (router: Router, item: NavigationTypeGuard): void => {
    // Since we are injecting the router via the store it is already up and running when we initiate
    if (checkTypeGuardIsSection(item)) {
      // if it's the section, then we seach the sections
      const sectionName = "/" + mediakiwiStore.mediakiwiSections.find((x) => x.name === item.name)?.name;
      // called to send user to target screen
      router.push(sectionName);
    } else {
      // if its navigationItem then we search in the Items
      const navigationItemId = mediakiwiStore.mediakiwiNavigationItems.find((x) => x.name === item.name)?.id;
      if (navigationItemId) {
        // called to send user to target screen
        router.push({ name: navigationItemId?.toString() });
      }
    }
  };
  // checks Type of ISection
  const checkTypeGuardIsSection = (toBeDetermined: NavigationTypeGuard): boolean => {
    if ((toBeDetermined as INavigationItem).path) {
      return false;
    }
    return true;
  };

  return {
    navigateTo,
  };
}
