<script setup lang="ts">  
  import { useMsal } from "@/composables/useMsal";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";

  const { instance, account } = useMsal();

  const isAuthenticated = useIsAuthenticated();
</script>

<template>
  <span v-if="isAuthenticated">
    <VContainer> {{ account?.username }} </VContainer>
  </span>
</template>
