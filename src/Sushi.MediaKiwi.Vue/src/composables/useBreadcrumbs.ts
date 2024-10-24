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

  /** Return if the item is the last in the collection */
  function isCurrentItem(navigationItem: NavigationItem): boolean {
    if (navigationItem) {
      return navigationItem.id === navigation.currentNavigationItem.value.id;
    }
    return false;
  }

  // go up the navigation tree starting from the current item
  const breadcrumbs = computed(() => {
    const currentItem = navigation.currentNavigationItem.value;
    const result: Array<NavigationItem> = [];
    let candidate: NavigationItem | undefined = { ...currentItem };

    while (candidate) {
      result.unshift(candidate);
      candidate = candidate.parent;
    }

    return result;
  });

  /** Determines if we show the whole breadcrumb or only a back button */
  const showBackButton = computed(() => xs.value && breadcrumbs.value.length > 1);

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

  return {
    breadcrumbs,
    showBackButton,
    clearCustomPageTitle,
    setCustomPageTitle,
    isCurrentItem,
  };
}
