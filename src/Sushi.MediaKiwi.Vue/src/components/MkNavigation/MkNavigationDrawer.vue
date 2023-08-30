<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { computed } from "vue";
  import type { NavigationItem } from "@/models/api";
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";
  import { useI18next } from "@/composables";
  import { IconsLibrary } from "@/models";

  // define properties
  defineEmits(["change"]);
  defineProps<{
    listItems: Array<NavigationItem>;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();

  const allNavigationItems = computed(getNavigationItems);
  const children = computed(getChildren);

  // inject dependencies
  const { defaultT } = await useI18next();

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
      const result = rootNode.children;
      return result;
    } else {
      // we are on the root level, so return all root items for current section
      const currentNavigationItem = navigation.currentNavigationItem.value;
      return store.rootNavigationItems.filter((x) => x.sectionId == currentNavigationItem?.sectionId);
    }
  }
</script>
<template>
  <v-navigation-drawer absolute class="pa-3">
    <v-list open-strategy="single" class="pa-0">
      <v-list-item
        v-if="navigation.currentRootItem.value"
        :title="defaultT('Back')"
        exact
        rounded="pill"
        class="mb-2"
        :prepend-icon="IconsLibrary.arrowLeft"
        @click.stop="navigation.navigateTo(navigation.currentRootItem.value)"
      />
      <mk-navigation-item v-for="item in children" :key="item.id" :navigation-item="item" :all-items="allNavigationItems"></mk-navigation-item>
    </v-list>
  </v-navigation-drawer>
</template>
