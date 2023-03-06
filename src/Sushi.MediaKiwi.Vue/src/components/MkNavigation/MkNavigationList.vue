<script setup lang="ts">
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { computed } from "vue";
  import MkNavigationItem from "../MkNavigationNew/MkNavigationItem.vue";

    const props = defineProps<{
      navigationItems:Array<INavigationItem>
    }>();

    const parentItems = computed(() => {
      const filtered = props.navigationItems.filter((x: INavigationItem) => {
        if (x && x?.parentNavigationItemId == null) {
          return x;
        }
      });
      return filtered ?? [];
    });
</script>

<template>    
  <v-list>
      <mk-navigation-item v-for="item in parentItems" :key="item.id" :navigation-item="item" :all-items="navigationItems"></mk-navigation-item>
  </v-list>
</template>
