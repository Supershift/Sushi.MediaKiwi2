<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
</script>

<template>
  <v-main style="min-height: 300px">
    <v-container>
      <mk-breadcrumbs />
      <RouterView :key="$route.path"></RouterView>
    </v-container>
  </v-main>
</template>
