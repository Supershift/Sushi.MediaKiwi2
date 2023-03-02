<script setup lang="ts">
import { useRoute } from "vue-router";
import { store } from "@/stores/mediakiwi/mock";
import MkNavigationItem from "./MkNavigationItem.vue";
import { getNavigationItemForRoute, getNavigationItemChildren } from '@/helpers/NavigationHelper'
import type { INavigationItem } from "@/models/navigation"

// hook up route
const route = useRoute();

// deterine current navigation items
const currentNavigationItem = getNavigationItemForRoute(route, store.navigationItems);

let children: INavigationItem[] = [];
if (currentNavigationItem !== undefined && currentNavigationItem.isDynamicRoute) {
  // if current navigation items has a data instance AND it has its own children, only render those children
  children = getNavigationItemChildren(currentNavigationItem, store.navigationItems, true);
}

if (children?.length > 0 == false) {
  // get root level navigation items
  children = getNavigationItemChildren(undefined, store.navigationItems, true);
}

</script>

<template>
  <v-navigation-drawer>
    <v-list>      
      <MkNavigationItem v-for="navigationItem in children" :navigation-item="navigationItem"> </MkNavigationItem>
    </v-list>
</v-navigation-drawer>
</template>
