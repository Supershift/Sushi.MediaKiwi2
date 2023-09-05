<script setup lang="ts">
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { computed } from "vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { useI18next } from "@/composables";
  import { IconsLibrary } from "@/models";

  // define properties
  defineEmits(["change"]);

  // inject dependencies
  const navigation = useNavigation(); // also calls store within this composable
  const { defaultT } = await useI18next();

  // get computed values from composables
  const allNavigationItems = computed(() => navigation.getAllItemsBasedOnSection());
  const items = computed(() => navigation.getItemsBasedOnRoot());
</script>
<template>
  <v-navigation-drawer absolute class="pa-3">
    <v-list open-strategy="single" class="pa-0">
      <v-list-item
        v-if="navigation.currentRootItem.value"
        :title="defaultT('Back')"
        exact
        rounded="pill"
        class="mb-2"
        :prepend-icon="IconsLibrary.arrowLeft"
        @click.stop="navigation.navigateTo(navigation.currentRootItem.value)"
      />
      <mk-navigation-item v-for="item in items" :key="item.id" :navigation-item="item" :all-items="allNavigationItems"></mk-navigation-item>
    </v-list>
  </v-navigation-drawer>
</template>
