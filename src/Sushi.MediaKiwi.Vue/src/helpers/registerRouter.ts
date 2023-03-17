import { DependencyContainer } from "tsyringe";
import { Router } from "vue-router";

export function registerRouter(container: DependencyContainer, router: Router) {
  // register router
  container.register("Router", {
    useValue: router,
  });
}
