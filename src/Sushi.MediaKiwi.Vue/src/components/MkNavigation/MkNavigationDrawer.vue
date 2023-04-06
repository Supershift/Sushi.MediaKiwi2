<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { computed } from "vue";
  import type { NavigationItem } from "@/models/api";
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";

  defineEmits(["change"]);
  defineProps<{
    listItems: Array<NavigationItem>;
  }>();

  const store = useMediakiwiStore();
  const navigation = useNavigation();

  const allNavigationItems = computed(getNavigationItems);
  const children = computed(getChildren);

  /** Gets all navigation items for the current item's section */
  function getNavigationItems(): NavigationItem[] {
    // get current navigation item
    const navigationItem = navigation.currentNavigationItem.value;

    // if route is not for a navigation item, return undefined
    if (!navigationItem) return [];

    // get all items for the current item's section
    const navigationItems = store.navigationItems.filter((x) => x.sectionId == navigationItem.sectionId);
    return navigationItems;
  }

  function getChildren() {
    // get current root navigation item
    const rootNode = navigation.currentRootItem.value;
    if (rootNode) {
      // get all children for navigation item
      const result = navigation.getChildren(rootNode);
      return result;
    } else {
      // we are on the root level, so return all root items for current section
      const currentNavigationItem = navigation.currentNavigationItem.value;
      return store.rootNavigationItems.filter((x) => x.sectionId == currentNavigationItem?.sectionId);
    }
  }
</script>
<template>
  <v-navigation-drawer absolute>
    <v-list open-strategy="single">
      <mk-navigation-item v-for="item in children" :key="item.id" :navigation-item="item" :all-items="allNavigationItems"></mk-navigation-item>
    </v-list>
  </v-navigation-drawer>
</template>
