<script setup lang="ts">
  import MkNavigationRail from "../MkNavigation/MkNavigationRail.vue";
  import MkDrawer from "../MkDrawer/MkDrawer.vue";
  import { computed } from "vue";
  import { useNavigationStore } from "@/stores/navigation";

  defineEmits(["change"]);

  // // populate the navigationstore when we are done fetching items and this component loads
  const navigationStore = useNavigationStore();
  navigationStore.getNavigation();

  const railItems = computed(() => navigationStore.sectionList ?? []);
  const listItems = computed(() => navigationStore.navigationList ?? []);
</script>

<template>
  <mk-navigation-rail :rail-items="railItems"></mk-navigation-rail>
  <mk-drawer v-model="navigationStore.drawer" :list-items="listItems"></mk-drawer>
</template>
