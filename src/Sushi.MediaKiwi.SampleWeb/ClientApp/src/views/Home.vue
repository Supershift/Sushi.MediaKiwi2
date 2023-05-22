<script setup lang="ts">
  import { useI18next } from "@supershift/mediakiwi-vue";

  // inject dependecies
  const { t } = useI18next("Home");
</script>

<template>
  <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card>
      <h1>{{ t("Header") }}</h1>
      <p>{{ t("Main") }}</p>
    </v-card>
  </v-lazy>
</template>
