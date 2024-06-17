<script setup lang="ts">
  import { MkApplication } from "@/components";
  import { useDisplay } from "vuetify";
  const { xs } = useDisplay();
</script>

<template>
  <mk-application>
    <template #logo>
      <picture>
        <source srcset="./assets/logo128.webp" media="(min-width: 600px)" />
        <source srcset="./assets/logoClassic.png" />
        <img src="./assets/logo128.webp" alt="Logo" />
      </picture>
    </template>
    <template #title>
      <v-toolbar-title v-if="!xs"> MediaKiwi 2 - Sample website</v-toolbar-title>
    </template>
  </mk-application>
</template>
