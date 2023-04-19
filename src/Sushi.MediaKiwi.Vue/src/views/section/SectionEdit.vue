<script setup lang="ts">
  import MkSectionEdit from "@/components/MkSection/MkSectionEdit.vue";
  import { MkSuspense } from "@/components";
</script>
<template>
  <mk-suspense>
    <MkSectionEdit />
    <template #fallback> Loading... </template>
  </mk-suspense>
</template>
