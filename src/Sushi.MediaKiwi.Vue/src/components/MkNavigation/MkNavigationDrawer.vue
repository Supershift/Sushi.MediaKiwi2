<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { useI18next } from "@/composables/useI18next";
  import { IconsLibrary } from "@/models";
  import { NAVIGATION_DRAWER_INFO_LOADED as NAVIGATION_DRAWER_INFO_LOADED } from "@/constants";

  // define properties
  defineEmits(["change"]);

  // inject dependencies
  const { getAllItemsBasedOnSection, getItemsBasedOnRoot, navigateTo, currentRootItem } = useNavigation(); // also calls store within this composable
  const { defaultT } = await useI18next();

  function navigationInfoLoaded() {
    // Dispatch an event to notify the listening component(s) that the navigation drawer info has been loaded
    window.dispatchEvent(new CustomEvent(NAVIGATION_DRAWER_INFO_LOADED));
  }
</script>
<template>
  <v-navigation-drawer class="pa-3">
    <v-list open-strategy="single" class="pa-0">
      <v-list-item
        v-if="currentRootItem"
        :title="defaultT('Back')"
        exact
        rounded="pill"
        class="mb-2"
        :prepend-icon="IconsLibrary.arrowLeft"
        @click.stop="navigateTo(currentRootItem)"
      />

      <div id="navigationDrawerInfo" class="mb-4" :on-load="navigationInfoLoaded()"></div>

      <mk-navigation-item
        v-for="item in getItemsBasedOnRoot()"
        :key="item.id"
        :navigation-item="item"
        :all-items="getAllItemsBasedOnSection()"
      ></mk-navigation-item>
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
