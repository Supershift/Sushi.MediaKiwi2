import { Router } from "vue-router"
import { MkLayout } from "@/constants";
/**
 * This Manager is used to dynamically update the Layouts system.
 * When the layout we want to display is not found, it loads the default layout MkLayout.Default, which is @/layouts/DefaultLayout.vue
 * MK ships with DefaultLayout.vue and FullScreenLayout.vue (MkLayout.Full)
 **/
export async function layoutManager(router: Router) {
  if (router) {
    router.afterEach(async (to, _from) => {
      if (to && to.meta && to.meta.layout) {
        try {
          const assignedLayout = to.meta.layout || MkLayout.Default;
          const layoutComponent = await import(`@/layouts/${assignedLayout}.vue`);
          to.meta.layoutComponent = layoutComponent.default;
        } catch (e) {
          const layoutComponent = await import(`@/layouts/${MkLayout.Default}.vue`);
          to.meta.layoutComponent = layoutComponent.default;
        }
      } else {
        console.log('Loaded without layout')
      }
    });
  }

}