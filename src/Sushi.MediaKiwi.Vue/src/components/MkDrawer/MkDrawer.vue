<script setup lang="ts">
  import MkNavigationList from "@/components/MkNavigation/MkNavigationList.vue";
  import { computed } from "vue";
  import { store } from "@/stores/mediakiwi/mock";
  import type { INavigationItem } from "@/models/navigation";
  defineEmits(["change"]);
  defineProps<{
    listItems: Array<INavigationItem>;
  }>();

  // get root level navigation items
  // TODO: Change to actual Data
  const navigationItems = computed(() => store.navigationItems.filter((item) => item.parentNavigationItemId == null));

</script>
<template>
  <v-navigation-drawer absolute>
    <v-list>
      <mk-navigation-list :navigation-items="navigationItems"></mk-navigation-list>
    </v-list>
  </v-navigation-drawer>
</template>
