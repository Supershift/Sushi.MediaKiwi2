<script setup lang="ts">
  import { getNavigationItemChildren } from "@/helpers";
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { useRouter, useRoute } from "@/router";
  import { computed } from "vue";

  const props = defineProps<{
    navigationItem: INavigationItem;
    allItems: Array<INavigationItem>;
  }>();

  const router = useRouter();
  
  const route = useRoute();
  const routeName = route.name;

  const isActive = computed(() => routeName === props.navigationItem.name);

  const nameLabel = computed(() => props.navigationItem?.name ?? "-empty-");

  // called to send user to target screen
  async function onItemClick(item: INavigationItem) {
    if (item.screenId !== undefined) {
      router.push(item.path);
    }
    return false;
  }

  const children = computed(() => getNavigationItemChildren(props.navigationItem, props.allItems, true));
</script>

<template>
  <v-list-group v-if="children.length > 0" :value="nameLabel">
    <template #activator="{ props }">
      <v-list-item v-bind="props"  :is-active="isActive" :active="isActive" :title="nameLabel" @click.stop="navigationItem?.screenId !== undefined ? onItemClick(navigationItem) : {}"></v-list-item>
    </template>
    <mk-navigation-item v-for="child in children" :navigation-item="child" :key="child.id" :all-items="allItems"></mk-navigation-item>
  </v-list-group>
  <v-list-item v-else :title="nameLabel" :active="isActive" @click.stop="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"> </v-list-item>
</template>
