import { createWebHistory, LocationQuery, LocationQueryRaw, type RouteRecordRaw, type RouterOptions } from "vue-router";
import SignIn from "@/views/SignIn.vue";
import LoginRedirect from "@/views/LoginRedirect.vue";
import QueryString from "qs";

/** Creates default router options based on provided modules. */
export function getDefaultRouterOptions(customRoutes?: RouteRecordRaw[], parseQueryArray?: boolean): RouterOptions {
  // create routes
  const routes = <RouteRecordRaw[]>[];

  // add custom routes
  if (customRoutes !== undefined) {
    customRoutes.forEach((customRoute) => routes.push(customRoute));
  }

  // add sign in screen
  routes.push({ path: "/signIn", component: SignIn });
  routes.push({ path: "/loginRedirect", component: LoginRedirect });
  routes.push({
    name: "root",
    path: "/",
    redirect: () => {
      return "/signIn";
    },
  });

  let routerOptions = <RouterOptions>{
    routes: routes,
    history: createWebHistory(),
    scrollBehavior: function (to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      if (to.hash) {
        return { el: to.hash, behavior: "smooth" };
      } else {
        return { top: 0, left: 0 };
      }
    },
  };
  // query parsing functions when parseQueryArray is true
  if (parseQueryArray) {
    routerOptions = <RouterOptions>{
      ...routerOptions,
      parseQuery: function (search: string): LocationQuery {
        return QueryString.parse(search, { parseArrays: true, allowEmptyArrays: true, strictNullHandling: true }) as LocationQuery;
      },
      stringifyQuery: function (query: LocationQueryRaw): string {
        return QueryString.stringify(query, { arrayFormat: "brackets", allowDots: true, strictNullHandling: true });
      },
    };
  }

  return routerOptions;
}
