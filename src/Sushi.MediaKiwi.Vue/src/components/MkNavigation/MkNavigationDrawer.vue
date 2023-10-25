<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { useI18next } from "@/composables/useI18next";
  import { IconsLibrary } from "@/models";

  // define properties
  defineEmits(["change"]);

  // inject dependencies
  const { getAllItemsBasedOnSection, getItemsBasedOnRoot, navigateTo, currentRootItem } = useNavigation(); // also calls store within this composable
  const { defaultT } = await useI18next();
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
      <mk-navigation-item
        v-for="item in getItemsBasedOnRoot()"
        :key="item.id"
        :navigation-item="item"
        :all-items="getAllItemsBasedOnSection()"
      ></mk-navigation-item>
    </v-list>
  </v-navigation-drawer>
</template>
