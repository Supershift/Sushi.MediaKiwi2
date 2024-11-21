import { useRouter } from "@/router";
import { defineAsyncComponent } from "vue";
import { RouteLocationNormalized } from "vue-router";

// Layouts available in the application
export const layouts = {
  Default: "DefaultLayout",
  FullScreen: "CustomLayout",
};


// Registers a layout manager that assigns layouts to routes based on the route's meta.layout property
export async function registerLayoutManager() {
  const router = useRouter();

  if (router) {
    router.afterEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized) => {
      if (to.meta) {
        // If the route is the sign-in page, do not assign a layout
        if (to.path === "/signIn") return;
        // If the route does not have a layout, assign the default layout
        if (!to.meta?.layout) to.meta.layout = layouts.Default;
        try {
          // Assign the layout component to the route
          const assignedLayout = defineAsyncComponent(() => import(`@sample/layouts/${to.meta.layout}.vue`));
          if (assignedLayout) to.meta.layoutComponent = assignedLayout;
          else throw new Error("Layout not found! Reverting to default layout.");
        } catch (e) {
          console.error(e);
          // Revert to default layout
          to.meta.layout = layouts.Default;
          to.meta.layoutComponent = defineAsyncComponent(() => import(`@sample/layouts/${layouts.Default}.vue`));
        }
      }
    });
  }
}