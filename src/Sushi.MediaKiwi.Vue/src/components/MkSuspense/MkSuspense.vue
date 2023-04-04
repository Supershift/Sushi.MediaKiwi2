<script setup lang="ts"></script>
<template>
  <Suspense>
    <slot></slot>
    <template #fallback>
      <v-progress-circular indeterminate></v-progress-circular>
    </template>
  </Suspense>
</template>
