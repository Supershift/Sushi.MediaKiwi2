<script setup lang="ts">
  import { getNavigationItemChildren } from "@/helpers";
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { useNavigationStore } from "@/stores/navigation";
  import { computed } from "vue";
  import { useRoute } from "vue-router";

  const props = defineProps<{
    navigationItem: INavigationItem,
    allItems: Array<INavigationItem>
  }>();

  const navigationStore = useNavigationStore();

  const route = useRoute();
  const routeName = route.name;

  const isActive = computed(() => routeName === props.navigationItem.name );

  const nameLabel = computed(() => props.navigationItem?.name ?? "-empty-")
  // called to send user to target screen
  function onItemClick(item: INavigationItem) {
    if (item && item?.screenId && item?.path) {
      navigationStore.NAVIGATE_TO(item.path, false);
    }
    return false;
  }

  const children = computed(() => getNavigationItemChildren(props.navigationItem, props.allItems, true))
    
</script>

<template>
  <v-list-group v-if="children.length > 0" :value="nameLabel">
    <template #activator="{ props }" :is-active="isActive">
      <v-list-item v-bind="props" :active="navigationItem" :title="nameLabel" @click="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"></v-list-item>
    </template>
    <mk-navigation-item v-for="child in children" :navigation-item="child" :key="child.id" :all-items="allItems"></mk-navigation-item>
  </v-list-group>
  <v-list-item v-else :title="nameLabel" :active="isActive" @click="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"> </v-list-item>
</template>
