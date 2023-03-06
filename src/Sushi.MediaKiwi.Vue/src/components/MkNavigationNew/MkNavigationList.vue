<script setup lang="ts">
  import { getNavigationItemChildren, getNavigationItemForRoute } from "@/helpers";
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { computed } from "vue";
  import { useRoute } from "vue-router";
  import MkNavigationItem from "../MkNavigationNew/MkNavigationItem.vue";

    const props = defineProps<{
      navigationItems:Array<INavigationItem>
    }>();
    const currentNavigationItem = getNavigationItemForRoute(useRoute(), props.navigationItems);
    
    const dynamicItems = computed(() => {
      if (currentNavigationItem !== undefined && currentNavigationItem.isDynamicRoute) {
        return getNavigationItemChildren(currentNavigationItem, props.navigationItems, true)
      }
    })
    const parentItems = computed(() => {
      if (dynamicItems.value && dynamicItems.value?.length > 0 == false) {
        return getNavigationItemChildren(undefined, props.navigationItems, true)
      }
      return dynamicItems.value;
    });
</script>

<template> 
  <v-list>
      <mk-navigation-item v-for="item in parentItems" :key="item.id" :navigation-item="item" :all-items="navigationItems"></mk-navigation-item>
  </v-list>
</template>
