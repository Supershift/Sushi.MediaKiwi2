<script setup lang="ts">
import { ref, defineAsyncComponent, computed } from 'vue'
import MkNavigation from './components/MkNavigation.vue';
import MkScreen from './components/MkScreen.vue';

const screens = [
  { id: 1, componentFileName: 'Screen1.vue' },
  { id: 2, componentFileName: 'Screen2.vue' },
  { id: 3, componentFileName: 'Screen3.vue' },
]

const currentScreen = ref(screens[0]);

function loadScreen(myScreen: { componentFileName: any; })
{
  return defineAsyncComponent(() => import(/* @vite-ignore */`./components/${myScreen.componentFileName}`));
}

function changeScreen(screenId: number) {    
  // search for screen to get componentname
  let selectedScreen = screens.find(x => x.id == screenId);
  if(selectedScreen != undefined)
  {
    currentScreen.value = selectedScreen;    
  }
}
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar title="Application bar"></v-app-bar>

      <MkNavigation @change="changeScreen"></MkNavigation>
      <MkScreen :current-screen="currentScreen"></MkScreen>
      
    </v-layout>
  </v-card>
</template>


