<script setup lang="ts">
  import { useNavigationStore } from "@/stores/navigation";
  const navigationStore = useNavigationStore();
</script>
<template>
  <v-app-bar-nav-icon class="d-lg-none" @click.stop="navigationStore.toggleDrawer" variant="text"></v-app-bar-nav-icon>
</template>
