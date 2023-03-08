import { createWebHistory, RouteLocationNormalizedLoaded, Router, type RouteRecordRaw, type RouterOptions } from "vue-router";
import { useRouter as useVueRouter, useRoute as useVueRoute, type RouteComponent } from "vue-router";
import type { INavigationItem } from "../models/navigation";
import type { IScreen } from "../models/screen/IScreen";
import pinia from "../plugins/pinia";
import { useMediakiwiStore } from "@/stores/index";
import SignIn from "@/views/SignIn.vue";

/** Creates router options based on provided modules. */
export function createMediakiwiRouterOptions(modules: Record<string, RouteComponent>, customRoutes?: RouteRecordRaw[]): RouterOptions {
  // Populate everything here first!
  // since we've initialized the pinia first we can access it here now
  const mediaKiwiStore = useMediakiwiStore(pinia);
  mediaKiwiStore.init();

  const navigationItems = mediaKiwiStore.mediakiwiNavigationItems;
  const screens = mediaKiwiStore.screens;

  // create routes
  const routes = <RouteRecordRaw[]>[];
  navigationItems.forEach((navigationItem: INavigationItem) => {
    // if the navigation item points to a screen, get the screen
    if (navigationItem.screenId != null && navigationItem.screenId !== undefined) {
      const screen = screens.find((x: IScreen) => x.id == navigationItem.screenId);

      if (screen != null && screen !== undefined && modules) {
        // find the module referenced by the screen
        const module = modules[screen.componentKey];
        if (module !== undefined) {
          // add a route to the module
          const route = <RouteRecordRaw>{
            path: navigationItem.path,
            name: navigationItem.id.toString(),
            component: module,
            meta: {
              requiresAuth: true,
            },
          };
          routes.push(route);
        } else {
          // no module found, give a warning
          console.warn(`No module found for screenID: ${screen.id}, component key: ${screen.componentKey}`);
        }
      }
    }
  });

  // add custom routes
  if (customRoutes !== undefined) {
    customRoutes.forEach((customRoute) => routes.push(customRoute));
  }

  // add default route
  // routes.push({ path: "/", component: () => routes.find((x) => x.name == "Home")?.component });

  // add sign in screen
  routes.push({ path: "/signIn", component: SignIn });

  const routerOptions = <RouterOptions>{
    routes: routes,
    history: createWebHistory(),
  };

  return routerOptions;
}

/**
 * Returns the router instance.
 */
export function useRouter(): Router {
  return useVueRouter();
}

/**
 * Returns the current route location.
 */
export function useRoute(): RouteLocationNormalizedLoaded {
  return useVueRoute();
}
