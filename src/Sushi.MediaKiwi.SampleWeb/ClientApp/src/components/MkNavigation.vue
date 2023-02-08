<script setup lang="ts">

import { store } from '../mkstore'
import { useRouter } from 'vue-router'
import type { INavigationItem } from '../models/INavigationItem';

const router = useRouter()

function itemClick(navigationItem : INavigationItem)
{
    router.push(`/${navigationItem.name}`);
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

