<script setup lang="ts">
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import MkNavigationItem from "./MkNavigationItem.vue";

  defineProps<{
    navigationItems: Array<INavigationItem>;
  }>();

</script>

<template>
  <v-list>
    <mk-navigation-item v-for="item in navigationItems" :navigation-item="item"></mk-navigation-item>
  </v-list>
</template>
