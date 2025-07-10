<script setup lang="ts">
  import { useMediakiwiStore } from "@/stores";

  const store = useMediakiwiStore();
</script>
<template>
  <v-app-bar-nav-icon class="d-xl-none" @click.stop="store.toggleDrawer" variant="text"></v-app-bar-nav-icon>
</template>
