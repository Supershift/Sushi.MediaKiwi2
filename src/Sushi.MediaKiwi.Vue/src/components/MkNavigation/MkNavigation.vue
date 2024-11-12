<script setup lang="ts">
  import MkNavigationRail from "@/components/MkNavigation/MkNavigationRail.vue";
  import { MkNavigationDrawer } from "@/components/MkNavigation/";
  import { RouterManager } from "@/router/routerManager";
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";
  import { computed, inject } from "vue";

  // define events
  defineEmits(["change"]);

  // inject dependencies
  const routerManager = inject<RouterManager>("RouterManager");

  // get values from navigation composables
  const { currentSections, getItemsBasedOnRoot, currentRootItem } = useNavigation();

  // initialize router manager
  await routerManager?.Initialize();

  // use dependencies
  const store = useMediakiwiStore();

  const hasMultipleNavigationItems = computed<boolean>(() => {
    const navigationItems = getItemsBasedOnRoot();

    if (navigationItems) {
      return navigationItems.length > 1;
    }

    return true;
  });
</script>

<template>
  <mk-navigation-rail v-if="currentSections.length > 1" v-model="store.drawer" :rail-items="currentSections"></mk-navigation-rail>
  <mk-navigation-drawer v-if="currentRootItem || hasMultipleNavigationItems" v-model="store.drawer"></mk-navigation-drawer>
</template>
