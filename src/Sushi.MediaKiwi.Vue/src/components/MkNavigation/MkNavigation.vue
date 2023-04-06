<script setup lang="ts">
  import MkNavigationRail from "@/components/MkNavigation/MkNavigationRail.vue";
  import { MkNavigationDrawer } from "@/components/MkNavigation/";
  import { RouterManager } from "@/router/routerManager";
  import { container } from "tsyringe";
  import { useMediakiwiStore } from "@/stores";
  import { ref } from "vue";

  // define events
  defineEmits(["change"]);

  // inject dependencies
  var routerManager = container.resolve<RouterManager>("RouterManager");

  // initialize router manager
  await routerManager.Initialize();

  // use dependencies
  const store = useMediakiwiStore();

  // use ref from store
  const sections = ref(store.sections);
  const navigationItems = ref(store.navigationItems);
</script>

<template>
  <mk-navigation-rail :rail-items="sections"></mk-navigation-rail>
  <mk-navigation-drawer v-model="store.drawer" :list-items="navigationItems"></mk-navigation-drawer>
</template>
