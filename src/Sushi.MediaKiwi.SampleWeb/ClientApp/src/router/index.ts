import type { App } from "vue";
import { store } from "@/stores/mediakiwi/mock";
import { useMediakiwiStore }from "@/stores/index";
import { createRouter, createWebHashHistory, type RouteRecordRaw, type RouterOptions } from "vue-router";
import type { INavigationItem } from "../models/navigation";
import type { IScreen } from "../models/screen/IScreen";

// const mediaKiwiStore = useMediakiwiStore();
// mediaKiwiStore.GET_NAVIGATION_ITEMS();

const navigationItems = store.navigationItems;
const screens = store.screens;

// create routes
const routes = <RouteRecordRaw[]>[];
navigationItems.forEach((navigationItem: INavigationItem) => {
  // if the navigation item points to a screen, get the screen
  if (navigationItem.screenId != null && navigationItem.screenId !== undefined) {
    const screen = screens.find((x: IScreen) => x.id == navigationItem.screenId);

    if (screen != null && screen !== undefined) {
      const route = <RouteRecordRaw>{
        path: navigationItem.path,
        component: () => import(/* @vite-ignore */ `./components/${screen?.componentFileName}`),
      };
      routes.push(route);
    }
  }
});

// add default route
routes.push({ path: "/", component: () => routes.find(x => x.name == "Home")?.component });

const routerOptions = <RouterOptions>{
  routes: routes,
  history: createWebHashHistory(),
};

const router = createRouter(routerOptions);

console.log(routes);

export default router;
