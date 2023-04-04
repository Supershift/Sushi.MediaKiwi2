<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { computed } from "vue";
  import type { NavigationItem } from "@/models/api";
  import { useMediakiwiStore } from "@/stores";
  import { getNavigationItemChildren } from "@/helpers";
  import { useNavigation } from "@/composables/useNavigation";
  import { watch } from "vue";
  import { useRoute } from "@/router";

  defineEmits(["change"]);
  defineProps<{
    listItems: Array<NavigationItem>;
  }>();

  const store = useMediakiwiStore();
  const navigation = useNavigation();
  // get root level navigation items
  // const navigationItems = computed(() => navigationStore.navigationList);

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
    // get current root
    const root = navigation.currentRootItem.value;
    // get all children for root
    const result = getNavigationItemChildren(root, allNavigationItems.value, true);
    return result;
  }
</script>
<template>
  <v-navigation-drawer absolute>
    <v-list open-strategy="single">      
      <mk-navigation-item v-for="item in children" :key="item.id" :navigation-item="item" :all-items="allNavigationItems"></mk-navigation-item>
    </v-list>
  </v-navigation-drawer>
</template>
