<script setup lang="ts">
  import { getNavigationItemChildren } from "@/helpers";
  import type { INavigationItem } from "@/models/navigation/INavigationItem";
  import { useRouter, useRoute } from "@/router";
  import { computed, ref } from "vue";

  const props = defineProps<{
    navigationItem: INavigationItem;
    allItems: Array<INavigationItem>;
  }>();

  const router = useRouter();
  const route = useRoute();
  const groupOpened = ref(false);
  const nameLabel = computed(() => props.navigationItem?.name ?? "-empty-");
  const children = computed(() => getNavigationItemChildren(props.navigationItem, props.allItems, true));
  const isActive = computed(() => route.path == props.navigationItem.path);

  function hasScreen(item: INavigationItem): boolean {
    if (item && item.screenId !== undefined) {
      return true;
    }
    return false;
  }

  // called to send user to target screen
  async function onItemClick(item: INavigationItem) {
    if (item.screenId !== undefined && item.screenId !== null) {
      router.push(item.path);
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
