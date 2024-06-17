import { setPageTitle } from "@/router/setPageTitle";
import { validateSections } from "@/router/validateSections";
import { DependencyContainer } from "tsyringe";
import { Router } from "vue-router";

export function registerRouter(container: DependencyContainer, router: Router) {
  // register router
  container.register("Router", {
    useValue: router,
  });

  // Add method to set page title
  setPageTitle(router);
  validateSections(router);
}
