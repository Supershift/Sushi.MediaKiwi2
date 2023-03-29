<script setup lang="ts">
  import { getNavigationItemChildren, getNavigationItemForRoute } from "@/helpers";
  import type { NavigationItem } from "@/models/api/NavigationItem";
  import { computed } from "vue";
  import { useRoute } from "@/router/index";
  import MkNavigationItem from "@/components/MkNavigation/MkNavigationItem.vue";
  import { useNavigationStore } from "@/stores/navigation";

  const props = defineProps<{
    navigationItems: Array<NavigationItem>;
  }>();

  const currentNavigationItem = computed(() => getNavigationItemForRoute(useRoute(), props.navigationItems));

  // check if its dynamic or not and collect the children items
  const parentItems = computed(() => {
    if (currentNavigationItem.value !== undefined && currentNavigationItem.value?.isDynamicRoute) {
      return getNavigationItemChildren(currentNavigationItem.value, props.navigationItems, true);
    } else {
      return getNavigationItemChildren(undefined, props.navigationItems, true);
    }
  });
</script>

<template>
  <v-list open-strategy="single">
    <mk-navigation-item v-for="item in parentItems" :key="item.id" :navigation-item="item" :all-items="navigationItems"></mk-navigation-item>
  </v-list>
</template>
