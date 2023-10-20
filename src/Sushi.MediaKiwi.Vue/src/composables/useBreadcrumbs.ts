import { computed, ref } from "vue";

/**
 * Page title for the breadcrumb.
 */
const pageTitle = ref<string | undefined>();

/**
 * Use keyboard shortcuts composable.
 * This function will return the addKeyboardShortcuts and removeKeyboardShortcuts functions.
 * These functions can be used to add and remove key shortcuts.
 * See link for options https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
 * @returns { addKeyboardShortcuts, removeKeyboardShortcuts, keysPressed, registerdKeyboardShortcuts }
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
