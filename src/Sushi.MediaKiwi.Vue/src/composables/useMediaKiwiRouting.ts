import { useMediakiwiStore } from "@/stores";
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { type Router } from "vue-router";

/*
  Returns the routing functions using the store and routers of mediakiwi
*/
export default function () {
  //const navigationStore = useNavigationStore();
  const mediakiwiStore = useMediakiwiStore();

  const navigateToScreen = (router: Router, name: string, isSection: boolean): void => {
    // Since we are injecting the router via the sotre it is already up and running when we initiate
    if (name && router) {
      // if it's the section, then we reset the navigation
      if (isSection) {
        const sectionName = "/" + mediakiwiStore.mediakiwiSections.find((x) => x.name === name)?.name;
        // called to send user to target screen
        router.push(sectionName);
      } else {
        // FIXME: Fix the dynamic route with the click trough
        // called to send user to target screen
        const navigationItemId = mediakiwiStore.mediakiwiNavigationItems.find((x) => x.name === name)?.id;
        console.log("here! " + navigationItemId);
        if (navigationItemId) {
          router.push({ name: navigationItemId?.toString() });
        } else {
          router.push("/Error");
        }
      }
    }
  };

  const navigateTo = (router: Router, id: number, next: NavigationGuardNext): void => {
    const route = router.getRoutes().find((x) => x.name === id.toString());
    if (route) {
      router
        .push(route)
        .then(() => {
          next();
        })
        .catch((error: Error) => {
          const routeName = route.name ?? "noName";
          console.error(`Error navigating to ${routeName.toString()}:`, error);
          next(false);
        });
    } else {
      console.error(`Error missing route`);
    }
  };

  return {
    navigateToScreen,
    navigateTo,
  };
}
