import { useSections } from "@/composables";
import { type RouteLocationNormalized, type Router } from "vue-router";

/**
 *
 */
export function validateSections(router: Router): void {
  const { validateSectionRules } = useSections();

  router.afterEach(() => {
    // Add rule to disable section if no hotels are available
    validateSectionRules();
  });
}
