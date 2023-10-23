import { computed, ref } from "vue";

/** Page title for the breadcrumb. */
const pageTitle = ref<string | undefined>();

/**
 * Composable to interfere for breadcrumbs.
 * TODO; May need further thought on how to handle in a more generic way.
 * @returns {Object} Object with customPageTitle and setCustomPageTitle.
 * @example
 */
export function useBreadcrumbs() {
  function setCustomPageTitle(value?: string) {
    pageTitle.value = value;
  }

  const customPageTitle = computed(() => pageTitle.value);

  return {
    setCustomPageTitle,
    customPageTitle,
  };
}
