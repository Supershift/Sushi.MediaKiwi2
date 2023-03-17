<script setup lang="ts">
  import MkNavigationRail from "../MkNavigation/MkNavigationRail.vue";
  import MkDrawer from "../MkDrawer/MkDrawer.vue";
  import { computed } from "vue";
  import { useNavigationStore } from "@/stores/navigation";
  import { useMediakiwiStore } from "@/stores";
  import { RouterHelper } from "@/router/routerHelper";
  import { container } from "tsyringe";
  import { useRouter } from "@/router";
  import { IMediakiwiVueOptions } from "@/models";

  // define events
  defineEmits(["change"]);

  // inject dependencies
  var routerHelper = container.resolve<RouterHelper>("RouterHelper");
  var mediakiwiOptions = container.resolve<IMediakiwiVueOptions>("MediakiwiOptions");

  // use dependencies
  var router = useRouter();
  const navigationStore = useNavigationStore();
  const mediakiwiStore = useMediakiwiStore();

  // init mediakiwi store
  await mediakiwiStore.init();

  // update routes from mk store TODO: make this reactive to changes
  routerHelper.updateRoutes(router, mediakiwiOptions.modules, mediakiwiStore.navigationItems, mediakiwiStore.screens);

  // populate the navigationstore when we are done fetching items and this component loads
  navigationStore.getNavigation();

  const railItems = computed(() => navigationStore.sectionList ?? []);
  const listItems = computed(() => navigationStore.navigationList ?? []);
</script>

<template>
  <mk-navigation-rail :rail-items="railItems"></mk-navigation-rail>
  <mk-drawer v-model="navigationStore.drawer" :list-items="listItems"></mk-drawer>
</template>
