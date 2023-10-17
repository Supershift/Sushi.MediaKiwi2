import { App } from "vue";

export function registerDirectives(app: App) {
  // register side sheet directive
  app.directive("side-sheet", {
    mounted(el) {
      // add class to element for the sidesheet => v-side-sheet can be used
      el.classList.add("mk-side-sheet-hook");
    },
  });
}
