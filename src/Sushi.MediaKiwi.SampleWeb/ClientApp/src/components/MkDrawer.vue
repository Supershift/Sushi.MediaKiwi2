<script setup lang="ts">
  import MkNavigationList from "@/components/MkNavigationList.vue";
  import { computed } from "vue";
  import { store } from "@/stores/mediakiwi/mock";
import type { INavigationItem } from "@/models/navigation";

  defineProps<{
    listItems: Array<INavigationItem>;
  }>();


</script>
<template>
  <v-navigation-drawer absolute>
    <v-list>
      <mk-navigation-list :navigation-items="listItems"></mk-navigation-list>
    </v-list>
  </v-navigation-drawer>
</template>