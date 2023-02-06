<script setup lang="ts">
import { ref } from 'vue'

import INavigationItem from "./models/INavigationItem";
import IScreen from "./models/IScreen";

const navigationItems = [
  { id: 1, name: "Hotels", screenId: 1, typeId: 1 },
  { id: 2, name: "Customers", screenId: 2, typeId: 1 },
  { id: 3, name: "Something else", screenId: 3, typeId: 1 },
]

const emit = defineEmits(['change'])

</script>

<template>
  <h1>Navigation</h1>
  <div>
    <button
       v-for="navigationItem in navigationItems"
       :key="navigationItem.id" 
       @click="$emit('change', navigationItem.screenId)"      
     >
      {{ navigationItem.name }}
    </button>
  </div>  
</template>