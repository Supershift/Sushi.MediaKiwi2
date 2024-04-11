<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components";
  import { IconsLibrary } from "@/models";
</script>

<template>
  <p class="ml-5 text-red">Incorrect/buggy breadcrumbs below...</p>
  <mk-breadcrumbs class="ml-5">
    <template #divider>
      <v-icon :icon="IconsLibrary.chevronRight"></v-icon>
    </template>
  </mk-breadcrumbs>
</template>
