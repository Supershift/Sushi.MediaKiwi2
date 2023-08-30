<script setup lang="ts">
  import { IconsLibrary } from "@/models";

  // define slots
  const slots = defineSlots<{
    default?: () => never;
  }>();
</script>

<template>
  <v-btn v-if="slots.default" icon color="primary">
    <!-- This icon should be loaded locally first, this only works because we have it preloaded in the MK project because MKFormToollbar and MkToolbar uses this  -->
    <v-icon :icon="IconsLibrary.dotsVertical"></v-icon>

    <v-menu activator="parent">
      <v-list>
        <slot></slot>
      </v-list>
    </v-menu>
  </v-btn>
</template>
