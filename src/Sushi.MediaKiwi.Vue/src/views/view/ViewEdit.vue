<script setup lang="ts">
  import MkViewEdit from "@/components/MkView/MkViewEdit.vue";
  import { MkSuspense } from "@/components";
</script>
<template>
  <mk-suspense>
    <mk-view-edit></mk-view-edit>
    <template #fallback> Loading... </template>
  </mk-suspense>
</template>
