import { Router } from "vue-router"
import { MkLayout } from "@/constants";
/**
 * This Manager is used to dynamically update the Layouts system.
 * When the layout we want to display is not found, it loads the default layout App Layout Default.vue
 **/
export async function loadLayout(router: Router) {
  if (router) {
    router.afterEach(async (to, _from) => {
      if (to && to.meta && to.meta.layout) {
        try {
          console.log('Init Layout Manager...');
          let layout = to.meta.layout;
          let layoutComponent = await import(`@/layouts/${layout}.vue`);
          to.meta.layoutComponent = layoutComponent.default;
          console.log(`Found layout ${layout}`);
        } catch (e) {
          console.log('No layout found, use default instead');
          let layout = MkLayout.Default;
          let layoutComponent = await import(`@/layouts/${layout}.vue`);
          to.meta.layoutComponent = layoutComponent.default;
        }
      } else {
        console.log('Loaded without meta layout')
      }
    });
  }

}