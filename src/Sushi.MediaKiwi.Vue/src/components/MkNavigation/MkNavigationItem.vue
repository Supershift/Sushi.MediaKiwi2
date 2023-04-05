<script setup lang="ts">
  import useMediaKiwiRouting from "@/composables/useMediaKiwiRouting";
  import { getNavigationItemChildren } from "@/helpers";
  import type { NavigationItem } from "@/models/api/NavigationItem";
  import { useRouter, useRoute } from "@/router";
  import { computed, ref } from "vue";

  const props = defineProps<{
    navigationItem: NavigationItem;
    allItems: Array<NavigationItem>;
  }>();

  const router = useRouter();
  const route = useRoute();

  const groupOpened = ref(false);
  const nameLabel = computed(() => props.navigationItem?.name ?? "-empty-");
  const children = computed(() => getNavigationItemChildren(props.navigationItem, props.allItems, true));
  const isActive = computed(() => (route.meta.navigationItem as NavigationItem)?.id == props.navigationItem.id);
  const { navigateTo } = useMediaKiwiRouting();

  function hasScreen(item: NavigationItem): boolean {
    if (item && item.viewId !== undefined) {
      return true;
    }
    return false;
  }

  // called to send user to target screen
  function onItemClick(item: NavigationItem) {
    if (item.viewId) {
      navigateTo(router, item);
    }
    return false;
  }
</script>

<template>
  <v-list-group v-if="children.length > 0" v-model="groupOpened" :value="nameLabel">
    <template #activator="{ props }">
      <v-list-item v-bind="props" :exact="true" :active-class="'active-list-item'" :title="nameLabel" @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}" />
    </template>
    <mk-navigation-item v-for="child in children" :key="child.id" :navigation-item="child" :all-items="allItems" />
  </v-list-group>
  <v-list-item
    v-else
    v-bind="navigationItem"
    :title="nameLabel"
    :exact="true"
    :active="isActive"
    :active-class="'active-list-item'"
    @click.stop="hasScreen(navigationItem) ? onItemClick(navigationItem) : {}"
  />
</template>

<style lang="css">
  .active-list-item {
    background-color: rgb(86, 86, 86, 0.2);
  }
</style>
