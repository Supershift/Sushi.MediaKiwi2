<script setup lang="ts">
  import MkNavigationRail from './MkNavigation/MkNavigationRail.vue';
  import MkDrawer from './MkDrawer/MkDrawer.vue';
  import { useMediakiwiStore } from '@/stores';
  
  defineEmits(["change"]);
  const mediaKiwiStore = useMediakiwiStore();
  mediaKiwiStore.GET_NAVIGATION_ITEMS();
  mediaKiwiStore.GET_SECTIONS();
  mediaKiwiStore.GET_SCREENS();

</script>

<template>
  <v-layout class="mt-80">
    <mk-navigation-rail></mk-navigation-rail>
    <mk-drawer></mk-drawer>
  </v-layout>
</template>
<style lang="css">
.mt-80 {
  margin-top: 80px;
}
</style>