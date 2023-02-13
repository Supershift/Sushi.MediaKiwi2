import type { App } from "vue";
import { store } from "@/stores/mediakiwi/mediakiwi";
import { createRouter, createWebHashHistory, type RouteRecordRaw, type RouterOptions } from "vue-router";

export function addRoutes(app: App) {
  // get all navigation items and screens
  const screens = store.screens;
  const navigationItems = store.navigationItems;

  // create routes
  const routes = <RouteRecordRaw[]>[];
  navigationItems.forEach((navigationItem) => {
    // if the navigation item points to a screen, get the screen
    if (navigationItem.screenId != null && navigationItem.screenId !== undefined) {
      const screen = screens.find((x) => x.id == navigationItem.screenId);

      if (screen != null && screen !== undefined) {
        const route = <RouteRecordRaw>{
          path: navigationItem.path,
          component: () => import(/* @vite-ignore */ `@/components/${screen?.componentFileName}.vue`),
        };
        routes.push(route);
      }
    }
  });

  console.log(routes);

  // add default route
  routes.push({ path: "/", component: () => routes[0].component });

  const routerOptions = <RouterOptions>{
    routes: routes,
    history: createWebHashHistory(),
  };
  const router = createRouter(routerOptions);

  app.use(router);
}
