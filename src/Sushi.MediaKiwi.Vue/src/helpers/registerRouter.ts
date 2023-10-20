import { MediakiwiVueOptions } from "@/models";
import { setPageTitle } from "@/router/setPageTitle";
import { DependencyContainer } from "tsyringe";
import { Router } from "vue-router";

export function registerRouter(container: DependencyContainer, router: Router, options?: MediakiwiVueOptions) {
  // register router
  container.register("Router", {
    useValue: router,
  });

  // Add method to set page title
  setPageTitle(router, options);
}
