<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import MkNavigationDrawerBackButton from "./MkNavigationDrawerBackButton.vue";

  defineEmits(["change"]);

  const { getItemsBasedOnRoot, currentRootItem } = useNavigation(); // also calls store within this composable
</script>
<template>
  <v-navigation-drawer class="pa-3">
    <v-list open-strategy="single" class="pa-0">
      <MkNavigationDrawerBackButton v-if="currentRootItem" />

      <div id="navigationDrawerInfo" class="mb-4"></div>

      <mk-navigation-item v-for="item in getItemsBasedOnRoot()" :key="item.id" :navigation-item="item"></mk-navigation-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped lang="scss">
  #navigationDrawerInfo {
    &:empty {
      display: none;
    }
  }
</style>
