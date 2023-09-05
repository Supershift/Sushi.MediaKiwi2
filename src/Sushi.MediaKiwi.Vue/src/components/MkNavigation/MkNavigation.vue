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
  const navigation = useNavigation();

  // initialize router manager
  await routerManager.Initialize();

  // use dependencies
  const store = useMediakiwiStore();

  // get values from navigation composables
  const sections = navigation.currentSections;
</script>

<template>
  <mk-navigation-rail v-if="sections.length > 1" v-model="store.drawer" :rail-items="sections"></mk-navigation-rail>
  <mk-navigation-drawer v-model="store.drawer"></mk-navigation-drawer>
</template>
