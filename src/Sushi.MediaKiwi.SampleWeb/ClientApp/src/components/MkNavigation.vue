<script setup lang="ts">

import { store } from '../mkstore'
import { INavigationItem } from '../models/INavigationItem';

const emit = defineEmits(['change'])

function itemClick(navigationItem : INavigationItem)
{
    if(navigationItem?.screenId !== undefined && navigationItem?.screenId != null)
    {
        store.currentScreenId = navigationItem.screenId;
        emit('change', navigationItem.screenId);
    }
}

</script>

<template>    
    <v-navigation-drawer>
        <v-list>
            <v-list-item v-for="navigationItem in store.navigationItems" :value="navigationItem.id"
                @click="itemClick(navigationItem)">
                {{ navigationItem.name }}
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

