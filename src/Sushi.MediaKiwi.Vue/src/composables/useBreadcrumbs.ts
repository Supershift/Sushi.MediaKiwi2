import { computed } from "vue";
import { useNavigation } from "@/composables/useNavigation";
import { NavigationItem } from "@/models/navigation";
import { useDisplay } from "vuetify/lib/framework.mjs";

export function useBreadcrumbs() {
  // Inject dependencies.
  const { xs } = useDisplay();
  const navigation = useNavigation();

  // go up the navigation tree starting from the current item
  const breadcrumbs = computed(() => {
    const currentItem = navigation.currentNavigationItem.value;
    const result: Array<NavigationItem> = [];
    let candidate: NavigationItem | undefined = { ...currentItem };

    // Adds all the parents of the current item to the breadcrumb path.
    while (candidate) {
      if (navigation.currentRootItem.value && candidate.id === navigation.currentRootItem.value.id) {
        // If we reach the root item, we add the item child of the root item to the breadcrumb path, if it exists.
        if (currentEntityNavigationItem.value && currentEntityNavigationItem.value.id !== navigation.currentNavigationItem.value.id) {
          result.unshift(currentEntityNavigationItem.value);
        }

        // We stop the loop when we reach the root item.
        break;
      }

      result.unshift(candidate);

      candidate = candidate.parent;
    }

    return result;
  });

  /**
   * Get the entity navigation item from the navigation tree.
   */
  function getEntityNavigationItem(navigationItem?: NavigationItem): NavigationItem | undefined {
    if (navigationItem && navigationItem.children?.length > 1) {
      return navigationItem.children[0]; // the first child is the item child.
    }
  }

  /** Ther current entity navigation item */
  const currentEntityNavigationItem = computed(() => getEntityNavigationItem(navigation.currentRootItem.value));

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

  function getBreadcrumbLabel(navigationItem?: NavigationItem): string {
    if (!navigationItem) {
      return "";
    }
    return navigationItem.breadcrumbLabel || navigationItem.name || "";
  }

  return {
    hasBreadcrumbs,
    breadcrumbs,
    showMobileBackButton,
    setCurrentBreadcrumbLabel,
    isCurrentNavigationItem,
    currentEntityNavigationItem,
    getEntityNavigationItem,
    getBreadcrumbLabel,
  };
}
