<script setup lang="ts">
  // define slots
  const slots = defineSlots<{
    /** Slot to render the logo */
    logo?: (props: unknown) => never;
    /** Slot to render the title the application, preferably v-toolbar-title */
    title?: (props: unknown) => never;
  }>();
</script>
<template>
  <div class="mk-logo-lockup py-3">
    <slot v-if="slots.logo" name="logo"></slot>
  </div>

  <slot v-if="slots.title" name="title"></slot>
</template>
<style lang="scss">
  .mk-logo-lockup {
    height: 100%;

    &__image,
    img {
      max-height: 100%;
      object-fit: contain;
    }
  }
</style>
