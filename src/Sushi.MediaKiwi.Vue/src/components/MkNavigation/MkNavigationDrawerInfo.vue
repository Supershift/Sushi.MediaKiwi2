<script setup lang="ts">
  import { NAVIGATION_DRAWER_INFO_LOADED } from "@/constants";
  import { ref } from "vue";

  const loaded = ref(false);

  function load() {
    loaded.value = true;
  }

  // Add an event listener to listen for
  window.addEventListener(NAVIGATION_DRAWER_INFO_LOADED, load);
</script>
<template>
  <teleport v-if="loaded" to="#navigationDrawerInfo">
    <slot></slot>
  </teleport>
</template>
