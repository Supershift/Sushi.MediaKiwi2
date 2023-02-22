import type { App } from "vue";
import { store } from "@/stores/mediakiwi/mediakiwi";
import {useMediakiwiStore }from "@/stores/index";
import { createRouter, createWebHashHistory, type RouteRecordRaw, type RouterOptions } from "vue-router";
import type { INavigationItem } from "./models/navigation";
import type { IScreen } from "./models/screen/IScreen";

export function addRoutes(app: App) {
  // TODO: Add this later
  // const mediakiwiStore = useMediakiwiStore();

  // mediakiwiStore.GET_NAVIGATION_ITEMS(mediakiwiStore.$state, 1);

  // // get all navigation items and screens
  // const screens = mediakiwiStore.screens;
  // const navigationItems = mediakiwiStore.mediakiwiNavigationItems;
  // console.log(navigationItems);


  const screens = store.screens;
  const navigationItems = store.navigationItems;
  // create routes
  const routes = <RouteRecordRaw[]>[];
  navigationItems.forEach((navigationItem: INavigationItem) => {
    // if the navigation item points to a screen, get the screen
    if (navigationItem.screenId != null && navigationItem.screenId !== undefined) {
      const screen = screens.find((x: IScreen) => x.id == navigationItem.screenId);

      if (screen != null && screen !== undefined) {
        const route = <RouteRecordRaw>{
          path: navigationItem.path,
          name: navigationItem.id.toString(),                    
          component: () => import(`./components/${screen.componentFileName}.vue`),
        };
        routes.push(route);
      }
    }
  });

  // add default route
  routes.push({ path: "/", component: () => routes[0].component });

  const routerOptions = <RouterOptions>{
    routes: routes,
    history: createWebHashHistory(),
  };
  const router = createRouter(routerOptions);

  app.use(router);
}
