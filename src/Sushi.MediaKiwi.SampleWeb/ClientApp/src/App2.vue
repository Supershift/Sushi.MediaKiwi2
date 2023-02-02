<script setup lang="ts">
import { ref } from 'vue'
import Screen1 from './components/Screen1.vue'
import Screen2 from './components/Screen2.vue'

const currentScreen = ref(Screen1)
const myValue = 'hello';
</script>

<template>
  <h1>{{ myValue }}</h1>
  <div>
    <button @click="currentScreen = Screen1">Screen 1</button><br/>
    <button @click="currentScreen = Screen2">Screen 2</button>
  </div> 
  <div>
    <component :is="currentScreen"></component>
  </div> 
</template>


