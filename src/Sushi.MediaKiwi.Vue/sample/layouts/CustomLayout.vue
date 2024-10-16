<script lang="ts" setup></script>
<template>
  <h1 class="mb-4">I'm a custom layout!</h1>
  <div class="custom-layout">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
  .custom-layout {
    max-width: 592px;
  }
</style>
