<script setup lang="ts">
  import { useI18next } from "@/composables";
  import { useSectionRules } from "@sample/composables/useSectionRules";

  // inject dependecies
  const { t, defaultT } = await useI18next();
  const { setHotelSectionDisplayState } = useSectionRules();

  function enableTestSection() {
    setHotelSectionDisplayState();
  }
</script>

<template>
  <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card variant="tonal" class="pa-4">
      <v-card-title tag="h1">{{ t("Header") }}</v-card-title>
      <v-card-text>
        <p>{{ t("A simple icon test") }} <v-icon icon="$testTube"></v-icon></p>
        <br />
        <p>Some things are still {{ defaultT("N-A") }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="flat" @click="enableTestSection">Enable Test Section</v-btn>
      </v-card-actions>
    </v-card>
  </v-lazy>
</template>
