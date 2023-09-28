<script setup lang="ts">
  import MkNavigationRail from "@/components/MkNavigation/MkNavigationRail.vue";
  import { MkNavigationDrawer } from "@/components/MkNavigation/";
  import { RouterManager } from "@/router/routerManager";
  import { container } from "tsyringe";
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";

  // define events
  defineEmits(["change"]);

  // inject dependencies
  const routerManager = container.resolve<RouterManager>("RouterManager");
  // get values from navigation composables
  const { currentSections } = useNavigation();

  // initialize router manager
  await routerManager.Initialize();

  // use dependencies
  const store = useMediakiwiStore();
</script>

<template>
  <mk-navigation-rail v-if="currentSections.length > 1" v-model="store.drawer" :rail-items="currentSections"></mk-navigation-rail>
  <mk-navigation-drawer v-model="store.drawer"></mk-navigation-drawer>
</template>
