<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { computed } from "vue";
  import { useNavigationStore } from "@/stores/navigation";
  import type { NavigationItem } from "@/models/api";
  import { useRoute } from "@/router";
  import { useMediakiwiStore } from "@/stores";
  import { getNavigationItemChildren } from "@/helpers";

  defineEmits(["change"]);
  defineProps<{
    listItems: Array<NavigationItem>;
  }>();

  const navigationStore = useNavigationStore();
  const store = useMediakiwiStore();

  // get root level navigation items
  // const navigationItems = computed(() => navigationStore.navigationList);

  const currentNavigationItem = computed(getCurrentNavigationItem);
  const allNavigationItems = computed(getNavigationItems);
  const currentNavigationTree = computed(getCurrentNavigationTree);
  function getCurrentNavigationItem(): NavigationItem | undefined {
    const route = useRoute();
    const result = route.meta.navigationItem as NavigationItem;
    return result;
  }

  /** Gets all navigation items for the current item's section */
  function getNavigationItems(): NavigationItem[] {
    // get current navigation item
    const navigationItem = getCurrentNavigationItem();

    // if route is not for a navigation item, return undefined
    if (!navigationItem) return [];

    // get all items for the current item's section
    const navigationItems = store.navigationItems.filter((x) => x.sectionId == navigationItem.sectionId);
    return navigationItems;
  }

  function determineCurrentRoootItem(): NavigationItem | undefined {
    // go up the tree untill a dynamic item with children is found OR we hit the root
    let result: NavigationItem | undefined = undefined;
    let candidate: NavigationItem | undefined = currentNavigationItem.value;
    while (candidate && !result) {
      if (candidate.isDynamicRoute && getNavigationItemChildren(candidate, store.navigationItems, true)?.length) {
        // we have found a dynamic route with children
        result = candidate;
      } else {
        if (candidate.parentNavigationItemId) {
          // get parent and use it as next candidate
          candidate = store.navigationItems.find((x) => x.id == candidate?.parentNavigationItemId);
        } else {
          // no more parent, we have found a result, it is the root node
          candidate = undefined;
          result = candidate;
        }
      }
    }
    return result;
  }

  function getCurrentNavigationTree() {
    // get current root
    const root = determineCurrentRoootItem();
    // get all children for root
    const result = getNavigationItemChildren(root, allNavigationItems.value, true);
    return result;
  }
</script>
<template>
  <v-navigation-drawer absolute>
    <v-list open-strategy="single">
      <!-- <mk-navigation-list :navigation-items="navigationItems"></mk-navigation-list> -->
      <mk-navigation-item v-for="item in currentNavigationTree" :key="item.id" :navigation-item="item" :all-items="allNavigationItems"></mk-navigation-item>
    </v-list>
  </v-navigation-drawer>
</template>
