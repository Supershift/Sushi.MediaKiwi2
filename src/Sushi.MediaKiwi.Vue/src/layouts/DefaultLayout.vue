<script lang="ts" setup></script>
<template>
  <h1 class="mb-4">I'm default!</h1>
  <div class="default-layout">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
  .default-layout {
    max-width: 1280px;
    height: inherit;
  }
</style>
