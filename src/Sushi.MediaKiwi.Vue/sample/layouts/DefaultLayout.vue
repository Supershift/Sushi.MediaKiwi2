<template>
  <div class="default-layout--default">
    <slot />
  </div>
</template>
<style lang="scss" scoped>
  .default-layout {
    &--default {
      max-width: 1280px;
      height: inherit;
    }
  }
</style>
