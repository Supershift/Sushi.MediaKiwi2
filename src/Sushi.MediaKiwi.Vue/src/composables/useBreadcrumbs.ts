import { computed, ref } from "vue";
import { useNavigation } from "./useNavigation";
import { NavigationItem } from "@/models/navigation";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useMediakiwiStore } from "@/stores";

export function useBreadcrumbs() {
  // Inject dependencies.
  const { xs } = useDisplay();
  const navigation = useNavigation();
  const store = useMediakiwiStore();

  // go up the navigation tree starting from the current item
  const breadcrumbs = computed(() => {
    const currentItem = navigation.currentNavigationItem.value;
    const result: Array<NavigationItem> = [];
    let candidate: NavigationItem | undefined = { ...currentItem };

    while (candidate) {
      result.unshift(candidate);
      candidate = candidate.parent;
    }

    // If we have a current root item, a back button is shown, so we remove the first item
    if (navigation.currentRootItem.value) {
      result.splice(0, 1);
    }

    return result;
  });

  /** Determines if we show the whole breadcrumb or only a back button */
  const showMobileBackButton = computed(() => xs.value && breadcrumbs.value.length);

  /** Check if the breadcrumbs have any items and if all have a name */
  const hasBreadcrumbs = computed(() => breadcrumbs.value.length && breadcrumbs.value.some((x) => x.name));

  /** Return if the item is the last in the collection */
  function isCurrentNavigationItem(navigationItem: NavigationItem): boolean {
    if (navigationItem) {
      return navigationItem.id === navigation.currentNavigationItem.value.id;
    }
    return false;
  }

  function setCustomPageTitle(value?: string) {
    if (navigation.currentNavigationItem.value) {
      navigation.currentNavigationItem.value.breadcrumbLabel = value;
    }
  }

  function clearCustomPageTitle(navigationItem: NavigationItem) {
    // find the item in the navigation tree
    const item = store.navigationTree.getNavigationItem(navigationItem.id);
    if (item) {
      item.breadcrumbLabel = undefined;
    }
  }

  async function getBreadcrumbLabel(navigationItem: NavigationItem) {
    try {
      // if the item has a getBreadcrumbLabel function, call it to get the breadcrumb label
      if (navigationItem.getBreadcrumbLabelCallback && !navigationItem.breadcrumbLabel) {
        const result = await navigationItem.getBreadcrumbLabelCallback(navigation.currentViewParameter.value);
        return result;
      }
    } catch (error) {
      // silent error, just log it to the console
      console.error(error);
    }
  }

  return {
    hasBreadcrumbs,
    breadcrumbs,
    showMobileBackButton,
    clearCustomPageTitle,
    setCustomPageTitle,
    isCurrentNavigationItem,
    getBreadcrumbLabel,
  };
}
