import { createWebHashHistory, RouteLocationNormalizedLoaded, Router, type RouteRecordRaw, type RouterOptions } from "vue-router";
import { useRouter as useVueRouter, useRoute as useVueRoute, type RouteComponent } from "vue-router";
import type { INavigationItem } from "../models/navigation";
import type { IScreen } from "../models/screen/IScreen";
import pinia from "../plugins/pinia";
import { useMediakiwiStore }from "@/stores/index";


/** Creates router options based on provided modules. */
export function createMediakiwiRouterOptions(modules: Record<string, RouteComponent>): RouterOptions {
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
        const route = <RouteRecordRaw>{
          path: navigationItem.path,
          name: navigationItem.id.toString(),
          component: modules[`./components/${screen?.componentFileName}.vue`],
        };
        routes.push(route);
      }
    }
  });

  // add default route
  routes.push({ path: "/", component: () => routes.find((x) => x.name == "Home")?.component });

  const routerOptions = <RouterOptions>{
    routes: routes,
    history: createWebHashHistory(),
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
