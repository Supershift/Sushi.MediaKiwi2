import { InitOptions, i18n } from "i18next";
import { ref, Ref, computed, inject, triggerRef, onUnmounted } from "vue";

export function useI18next(options?: InitOptions, sync?: boolean) {
  // get global i18next from app
  const globalI18next = inject<Ref<i18n>>("i18next");

  if (!globalI18next) {
    throw new Error("i18next is not provided, install the plugin first");
  }

  // create local i18next instance if options are provided
  let localI18next = globalI18next;
  if (options) {
    localI18next = ref(globalI18next.value.cloneInstance({ lng: globalI18next.value.resolvedLanguage, ...options }));
    if (sync) {
      // sync local i18next instance with global instance
      const syncLanguage = (lng: string) => {
        localI18next.value.changeLanguage(lng);
        triggerRef(localI18next);
      };
      globalI18next.value.on("languageChanged", syncLanguage);

      // unsubscribe language sync on unmount
      onUnmounted(() => {
        globalI18next.value.off("languageChanged", syncLanguage);
      });
    }
  }

  // provide reactive t function
  const t = computed(() => localI18next!.value.t);

  return { i18next: localI18next, t };
}
