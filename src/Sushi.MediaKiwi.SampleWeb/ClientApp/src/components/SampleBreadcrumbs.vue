<script setup lang="ts">
  import { MkBreadcrumbs } from "@supershift/mediakiwi-vue";
</script>

<template>
  <p class="ml-5 text-red">Incorrect/buggy breadcrumbs below...</p>
  <mk-breadcrumbs class="ml-5">
    <template #divider>
      <v-icon icon="$forward"></v-icon>
    </template>
  </mk-breadcrumbs>
</template>
