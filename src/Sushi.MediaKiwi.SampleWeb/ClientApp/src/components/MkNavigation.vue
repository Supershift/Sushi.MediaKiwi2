<script setup lang="ts">
  import MkNavigationRail from './MkNavigationRail.vue';
  import MkDrawer from './MkDrawer.vue';
  import { computed } from 'vue';
  import { useNavigationStore } from '@/stores/navigation';
  
  defineEmits(["change"]);
  
  // populate the navigationstore when we are done fetching items and this component loads
  const navigationStore = useNavigationStore();
  navigationStore.GET_NAVIGATION();

  //TODO: Add the main mediaKiwi store and helper instead of this
  const railItems = computed(() => navigationStore.sectionList ?? []);
  const listItems = computed(() => navigationStore.navigationList ?? []);
</script>

<template>
  <v-layout class="mt-80">
    <mk-navigation-rail :rail-items="railItems" ></mk-navigation-rail>
    <mk-drawer :list-items="listItems"></mk-drawer>
  </v-layout>
</template>
<style lang="css">
.mt-80 {
  margin-top: 80px;
}
</style>