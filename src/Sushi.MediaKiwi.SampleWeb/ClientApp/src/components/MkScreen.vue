<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { store } from '../mkstore'

function loadScreen2() {
    var currentScreen = store.getCurrentScreen();    
    if (currentScreen !== undefined) {
        return defineAsyncComponent(() => import(/* @vite-ignore */`../components/${currentScreen.componentFileName}`));
    }
}
</script>

<template>
    <v-main style="min-height: 300px;">
        <component :is="loadScreen2()"></component>
    </v-main>
</template>