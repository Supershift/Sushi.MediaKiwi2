import { createWebHistory, type RouteRecordRaw, type RouterOptions } from "vue-router";
import SignIn from "@/views/SignIn.vue";
import LoginRedirect from "@/views/LoginRedirect.vue";
import Home from "@/views/Home.vue";
import { identity } from "@/identity";
import { isAuthenticated } from "../identity/isAuthenticated";
import { InteractionType } from "@azure/msal-browser";

/** Creates default router options based on provided modules. */
export function getDefaultRouterOptions(customRoutes?: RouteRecordRaw[]): RouterOptions {
  // create routes
  const routes = <RouteRecordRaw[]>[];

  // add custom routes
  if (customRoutes !== undefined) {
    customRoutes.forEach((customRoute) => routes.push(customRoute));
  }

  // add sign in screen
  routes.push({ path: "/signIn", component: SignIn });
  routes.push({ path: "/loginRedirect", component: LoginRedirect });
  routes.push({ path: "/home", component: Home, meta: { requiresAuth: true } });
  routes.push({
    path: "/",
    redirect: (to) => {
      // if the user is authenticated, redirect to home, else redirect to sign in
      return isAuthenticated() ? "/home" : "signIn";
    },
  });

  const routerOptions = <RouterOptions>{
    routes: routes,
    history: createWebHistory(),
  };

  return routerOptions;
}
