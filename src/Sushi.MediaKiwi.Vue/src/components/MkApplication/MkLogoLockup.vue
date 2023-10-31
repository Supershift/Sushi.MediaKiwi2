<script setup lang="ts">
  import type { MediakiwiVueOptions } from "@/models";
  import { inject } from "vue";

  const mediakiwi = inject("mediakiwi") as MediakiwiVueOptions;

  // define slots
  const slots = defineSlots<{
    logo?: (props: unknown) => never;
    title?: (props: unknown) => never;
  }>();
</script>
<template>
  <div class="mk-logo-lockup pl-5 py-3">
    <slot v-if="slots.logo" name="logo"></slot>
    <img v-else-if="mediakiwi.logo" class="mk-logo-lockup__image" :src="mediakiwi.logo" :alt="mediakiwi.title" />
  </div>

  <slot v-if="slots.title" name="title"></slot>
  <v-toolbar-title v-else-if="mediakiwi.title">{{ mediakiwi.title }}</v-toolbar-title>
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
