<script setup lang="ts">
  import { computed, ref } from "vue";
  import { container } from "tsyringe";
  import { SectionConnector } from "@/services";
  import { ListResult, Paging, Section, TableMap } from "@/models";
  import { MkTable } from "@/components";
  import { useColors, useTypography, useElevations } from "@/composables";
  import ColorGrid from "./components/ColorGrid.vue";
  import { useTheme } from "vuetify/lib/framework.mjs";
  const theme = useTheme();

  const availableThemes = computed(() => Object.keys(theme.themes.value));
</script>

<template>
  <v-card variant="tonal" rounded="xl" class="pa-8 mb-8" v-for="theme in availableThemes" :theme="theme">
    <v-card-title class="text-title-large pa-0 mb-4">{{ theme }} theme</v-card-title>
    <v-card-text class="pa-0">
      <ColorGrid :theme="theme" />
    </v-card-text>
  </v-card>
</template>
<style scoped lang="scss">
  .text-title-large {
    text-transform: capitalize;
  }
</style>
