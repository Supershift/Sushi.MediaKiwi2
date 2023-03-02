<script setup lang="ts">
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import MkNavigationItemOld from "./MkNavigationItemOld.vue";

  defineProps<{
    navigationItems: Array<INavigationItem>;
  }>();
</script>

<template>
  <v-list>
    <mk-navigation-item-old v-for="item in navigationItems" :navigation-item="item"></mk-navigation-item-old>
  </v-list>
</template>
