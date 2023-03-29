<script setup lang="ts">
  import MkNavigationRail from "@/components/MkNavigation/MkNavigationRail.vue";
  import MkDrawer from "@/components/MkDrawer/MkDrawer.vue";
  import { useNavigationStore } from "@/stores/navigation";
  import { RouterManager } from "@/router/routerManager";
  import { container } from "tsyringe";
  import { storeToRefs } from "pinia";

  // define events
  defineEmits(["change"]);

  // inject dependencies
  var routerManager = container.resolve<RouterManager>("RouterManager");

  // initialize router manager
  await routerManager.Initialize();

  // use dependencies
  const navigationStore = useNavigationStore();

  // populate the navigationstore when we are done fetching items and this component loads
  navigationStore.getNavigation();

  // use ref from store
  const { navigationList, sectionList } = storeToRefs(navigationStore);
</script>

<template>
  <mk-navigation-rail :rail-items="sectionList"></mk-navigation-rail>
  <mk-drawer v-model="navigationStore.drawer" :list-items="navigationList"></mk-drawer>
</template>
