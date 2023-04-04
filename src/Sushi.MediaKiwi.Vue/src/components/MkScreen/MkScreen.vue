<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
</script>

<template>
  <v-main style="min-height: 300px">
    <mk-breadcrumbs />
    <suspense>
      <template #default>
        <router-view />
      </template>
      <template #fallback>
        <v-progress-circular indeterminate></v-progress-circular>
      </template>
    </suspense>
  </v-main>
</template>
