<script setup lang="ts">
  import useMediaKiwiRouting from "@/composables/useMediaKiwiRouting";
  import { getNavigationItemChildren } from "@/helpers";
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { useRouter } from "@/router";
  import { computed } from "vue";
  import { useRoute } from "@/router";

  const props = defineProps<{
    navigationItem: INavigationItem,
    allItems: Array<INavigationItem>
  }>();

  const { NavigateToScreen } = useMediaKiwiRouting();
  const router = useRouter();

  const route = useRoute();
  const routeName = route.name;

  const isActive = computed(() => routeName === props.navigationItem.name);

  const nameLabel = computed(() => props.navigationItem?.name ?? "-empty-")
  
  // called to send user to target screen
  function onItemClick(item: INavigationItem) {
    if (item && item?.screenId && item?.path) {
      NavigateToScreen(router, item.screenId, false)
    }
    return false;
  }

  const children = computed(() => getNavigationItemChildren(props.navigationItem, props.allItems, true))
    
</script>

<template>
  <v-list-group v-if="children.length > 0" :value="nameLabel">
    <template #activator="{ props }" :is-active="isActive">
      <v-list-item v-bind="props" :active="isActive"  :title="nameLabel" @click="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"></v-list-item>
    </template>
    <mk-navigation-item v-for="child in children" :navigation-item="child" :key="child.id" :all-items="allItems"></mk-navigation-item>
  </v-list-group>
  <v-list-item v-else :title="nameLabel" :active="isActive" @click="navigationItem?.screenId != null ? onItemClick(navigationItem) : {}"> </v-list-item>
</template>
