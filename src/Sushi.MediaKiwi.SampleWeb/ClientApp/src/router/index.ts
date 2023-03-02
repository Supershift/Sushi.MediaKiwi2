import {  defineAsyncComponent } from "vue";
import { useMediakiwiStore }from "@/stores/index";
import { createRouter, createWebHistory, type RouteRecordRaw, type RouterOptions } from "vue-router";
import type { INavigationItem } from "../models/navigation";
import type { IScreen } from "../models/screen/IScreen";
import pinia from "@/stores/pinia";
import SkeletonComponent from "@/components/SkeletonComponent.vue";
import ErrorComponent from "@/components/ErrorComponent.vue";
import Home from "@/components/Home.vue";

// Populate everything here first!
// since we've initialized the pinia first we can access it here now
const mediaKiwiStore = useMediakiwiStore(pinia);
await mediaKiwiStore.GET_NAVIGATION_ITEMS();
await mediaKiwiStore.GET_SECTIONS();
await mediaKiwiStore.GET_SCREENS();

// laod the items and screens we need to navigate first
const navigationItems = mediaKiwiStore.mediakiwiNavigationItems ;
const screens =  mediaKiwiStore.mediakiwiScreens;

//dynamically load the components with Async
const loadComponent = (componentFileName: string) => {
  // Load Component asynchronously and use dynamic import
  // Skeletoncomponent is our empty body when we're loading 
  // ErrorComponent is our fallback
  if (componentFileName == "Home") {
    return Home;
  }
  return  () => import(/* @vite-ignore */ `../components/${componentFileName}.vue`);
}
// create routes
const routes = <RouteRecordRaw[]>[];
navigationItems.forEach((navigationItem: INavigationItem) => {
  // if the navigation item points to a screen, get the screen
  if (navigationItem.screenId != null && navigationItem.screenId !== undefined) {
    // Match screens with the items we have
    const screen = screens.find((x: IScreen) => x.id == navigationItem?.screenId);

    if (screen != null && screen !== undefined) {
      // create routes based on the screens that we just matched
      const route = <RouteRecordRaw>{
        path: navigationItem.path,
        name: navigationItem.name,
        component: loadComponent(screen?.componentFileName),
      };

      routes.push(route);
    }
  }
});

const routerOptions = <RouterOptions>{
  routes: routes,
  history: createWebHistory(),
};

const router = createRouter(routerOptions);
// add default route
router.push({ path: "/", name: routes.find(x => x.path == "/")?.name ?? "Hotels", });

router.beforeEach((to, from, next) =>{
  next()
});

console.log(routes);
 
export default router;
