<script setup lang="ts">
  import { store } from "@/stores/mediakiwi/mediakiwi";
  import MkNavigationItem from "./MkNavigationItem.vue";

  // get root level navigation items
  var rootLevelItems = store.navigationItems.filter((item) => item.parentNavigationItemId == null);

  defineEmits(["change"]);
</script>

<template>
  <v-navigation-drawer>
    <v-list>
      <MkNavigationItem v-for="navigationItem in rootLevelItems" :key="navigationItem" :navigation-item="navigationItem"> </MkNavigationItem>
    </v-list>
  </v-navigation-drawer>
</template>
