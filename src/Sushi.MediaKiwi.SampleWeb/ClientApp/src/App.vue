<script setup lang="ts">
import { ref, defineAsyncComponent } from 'vue'
import Navigation from './components/Navigation.vue'

const screens = [
  { id: 1, componentFileName: 'Screen1.vue' },
  { id: 2, componentFileName: 'Screen2.vue' },
  { id: 3, componentFileName: 'Screen3.vue' },
]

const currentScreen = ref(screens[0]);

function loadCurrentScreen()
{
  return defineAsyncComponent(() => import(/* @vite-ignore */`./components/${currentScreen.value.componentFileName}`));
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
  <h1>Hello</h1>
  <div>
    <Navigation @change="changeScreen" />
  </div>  
  <div>    
    Current screen name: {{ currentScreen.componentFileName }}
  </div>
  <div>
    <component :is="loadCurrentScreen()"></component>
  </div>   
</template>


