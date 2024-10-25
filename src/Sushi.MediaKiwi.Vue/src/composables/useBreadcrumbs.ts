import { computed, ref } from "vue";
import { useNavigation } from "./useNavigation";
import { NavigationItem } from "@/models/navigation";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useMediakiwiStore } from "@/stores";
import { get } from "cypress/types/lodash";

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

    if (navigation.currentRootItem.value) {
      // If we have a current root item, a back button is shown, so we remove the first item(s).
      while (result.length > 1 && result[0].id !== navigation.currentNavigationItem.value.id) {
        result.shift();
      }

      // if the current view the item child in the collection, we add this to the breadcrumb path
      if (itemChild.value && itemChild.value.id !== navigation.currentNavigationItem.value.id) {
        result.unshift(itemChild.value);
      }
    }

    return result;
  });

  function getItemChild(navigationItem?: NavigationItem): NavigationItem | undefined {
    if (navigationItem && navigationItem.children?.length > 1) {
      return navigationItem.children[0]; // the first child is the item child.
    }
  }

  const itemChild = computed(() => getItemChild(navigation.currentRootItem.value));

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

  function setCurrentBreadcrumbLabel(value?: string) {
    if (navigation.currentNavigationItem.value) {
      navigation.currentNavigationItem.value.breadcrumbLabel = value;
    }
  }

  function clearCurrentBreadcrumbLabel(navigationItem: NavigationItem) {
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
        const viewParameterValue = navigation.getViewParameter(navigationItem);
        if (viewParameterValue) {
          const result = await navigationItem.getBreadcrumbLabelCallback(viewParameterValue);
          return result;
        }
      }
    } catch (error) {
      // silent error, just log it to the console
      console.error("getBreadcrumbLabel", error);
    }
  }

  return {
    hasBreadcrumbs,
    breadcrumbs,
    showMobileBackButton,
    clearCurrentBreadcrumbLabel,
    setCurrentBreadcrumbLabel,
    isCurrentNavigationItem,
    getBreadcrumbLabel,
    itemChild,
    getItemChild,
  };
}
