<script setup lang="ts">
  import { useI18next } from "@/composables";

  // inject dependecies
  const { t, defaultT } = await useI18next();
</script>

<template>
  <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card>
      <h1>{{ t("Header") }}</h1>
      <p>
        <br />
        {{ t("Main") }}
        <br />
        {{ t("A simple icon test") }} <v-icon icon="$testTube"></v-icon>
        <br />
        <p>Some things are still {{ defaultT("N-A") }}</p>
      </p>
    </v-card>
  </v-lazy>
</template>
