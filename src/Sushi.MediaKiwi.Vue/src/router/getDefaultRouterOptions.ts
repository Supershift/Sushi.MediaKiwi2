import { createWebHistory, type RouteRecordRaw, type RouterOptions } from "vue-router";
import SignIn from "@/views/SignIn.vue";
import LoginRedirect from "@/views/LoginRedirect.vue";
import QueryString from "qs";

/** Creates default router options based on provided modules. */
export function getDefaultRouterOptions(customRoutes?: RouteRecordRaw[], parseQuery?: boolean): RouterOptions {
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

  const routerOptions = <RouterOptions>{
    routes: routes,
    parseQuery: function (search: string) {
      if (!parseQuery) return QueryString.parse(search, { parseArrays: false });
      return QueryString.parse(search, { parseArrays: true, allowEmptyArrays: true, strictNullHandling: true });
    },
    stringifyQuery: function (query: any) {
      if (!parseQuery) return QueryString.stringify(query, { arrayFormat: "repeat" });
      return QueryString.stringify(query, { arrayFormat: "brackets", strictNullHandling: true });
    },
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

  return routerOptions;
}
