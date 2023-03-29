<script setup lang="ts">
  import MkNavigationList from "@/components/MkNavigation/MkNavigationList.vue";
  import { computed } from "vue";
  import { useNavigationStore } from "@/stores/navigation";
  import type { NavigationItem } from "@/models/api";
  defineEmits(["change"]);
  defineProps<{
    listItems: Array<NavigationItem>;
  }>();

  const navigationStore = useNavigationStore();

  // get root level navigation items
  const navigationItems = computed(() => navigationStore.navigationList);
</script>
<template>
  <v-navigation-drawer absolute>
    <v-list>
      <mk-navigation-list :navigation-items="navigationItems"></mk-navigation-list>
    </v-list>
  </v-navigation-drawer>
</template>
