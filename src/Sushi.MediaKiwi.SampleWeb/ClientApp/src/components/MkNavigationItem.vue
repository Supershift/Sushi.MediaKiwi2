<script setup lang="ts">
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { store } from "@/stores/mediakiwi/mediakiwi";
  import { useRouter } from "vue-router";

  const props = defineProps<{
    navigationItem: INavigationItem;
  }>();

  // get the children for the navigation item
  var children = store.navigationItems.filter((item) => item.parentNavigationItemId == props.navigationItem.id);

  // hook up router
  const router = useRouter();

  // called to send user to target screen
  function itemClick(navigationItem: INavigationItem) {
    router.push(navigationItem.path);
  }
</script>

<template>
  <v-list-group v-if="children.length > 0">
    <template #activator="{ props }">
      <v-list-item v-bind="props" :title="navigationItem.name" @click="navigationItem.screenId != null ? itemClick(navigationItem) : {}"> </v-list-item>
    </template>
    <MkNavigationItem v-for="child in children" :navigation-item="child"></MkNavigationItem>
  </v-list-group>
  <v-list-item v-else :title="navigationItem.name ?? ''" @click="navigationItem.screenId != null ? itemClick(navigationItem) : {}"> </v-list-item>
</template>
