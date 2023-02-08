<script setup lang="ts">

import { store } from '../mkstore'
import MkNavigationItem from './MkNavigationItem.vue';

// get root level navigation items
var rootLevelItems = store.navigationItems.filter(item => item.parentNavigationItemId == null);

</script>

<template>    
    <v-navigation-drawer>
        <v-list>
            <MkNavigationItem v-for="navigationItem in rootLevelItems" :navigation-item="navigationItem">
            </MkNavigationItem>
        </v-list>
    </v-navigation-drawer>    
</template>

