<script setup lang="ts">
  import { MkBreadcrumbs } from '@/components/MkBreadcrumbs/';
</script>

<template>
  <v-main style="min-height: 300px">
    <mk-breadcrumbs />
    <router-view />
  </v-main>
</template>
