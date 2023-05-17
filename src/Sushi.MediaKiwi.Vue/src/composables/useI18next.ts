import { i18n } from "i18next";
import { Ref, computed, inject } from "vue";

/**
 * Adds i18next to the component.
 * @param namespace If provided, the t function will be scoped to this namespace.
 * @returns
 */
export function useI18next(namespace?: string) {
  // get global i18next from app
  const i18next = inject<Ref<i18n>>("i18next");

  if (!i18next) {
    throw new Error("i18next is not provided, install the plugin first");
  }

  // provide reactive t function for provided namespace
  const t = computed(() => {
    if (namespace) {
      return i18next.value.getFixedT(null, namespace);
    } else {
      return i18next.value.t;
    }
  });

  const defaultT = computed(() => i18next.value.t);

  return {
    i18next,
    /** T function scoped to the namespace provided when adding composable. If non provided, scoped to default. */
    t,
    /** T function scoped to the default namespace */
    defaultT,
  };
}
