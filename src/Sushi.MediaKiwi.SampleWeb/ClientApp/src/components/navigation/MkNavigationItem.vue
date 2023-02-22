<script setup lang="ts">
import { computed } from "@vue/reactivity";
import type { INavigationItem } from "@/models/navigation";
import { store } from "@/stores/mediakiwi/mediakiwi";
import { useRoute, useRouter } from "vue-router";
import { getNavigationItemChildren } from '@/helpers/NavigationHelper'

const props = defineProps<{
  navigationItem: INavigationItem;
}>();

// hook up router
const route = useRoute();
const router = useRouter();

// get the children for the navigation item
var children = getNavigationItemChildren(props.navigationItem, store.navigationItems, true);

// called to send user to target screen
function itemClick(navigationItem: INavigationItem) {
  router.push(navigationItem.path);
}

const isActive = computed(() => route.name == props.navigationItem.name );

</script>

<template>
  <v-list-group v-if="children.length > 0">
    <template #activator="{ props }">
      <v-list-item v-bind="props" :title="navigationItem.name" :active="isActive"
        @click="navigationItem.screenId != null ? itemClick(navigationItem) : {}"> </v-list-item>
    </template>
    <MkNavigationItem v-for="child in children" :navigation-item="child"></MkNavigationItem>
  </v-list-group>
  <v-list-item v-else :title="navigationItem.name" :active="isActive"
  @click="navigationItem.screenId != null ? itemClick(navigationItem) : {}"> </v-list-item>
</template>
