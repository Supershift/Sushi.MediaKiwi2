<script setup lang="ts">
  import { useI18next } from "@/composables";
  import { Section } from "@/models/navigation";
  import { useMediakiwiStore, useSnackbarStore } from "@/stores";
  import { computed } from "vue";

  // inject dependecies
  const { t, defaultT } = await useI18next();
  const mediakiwiStore = useMediakiwiStore();
  const snackbar = useSnackbarStore();

  //
  const settingsSection = computed<Section | undefined>(() => mediakiwiStore?.navigationTree?.sections?.find((x) => x.id === "Settings"));

  function toggleSection() {
    if (!settingsSection.value) return;

    if (settingsSection.value.isHidden) {
      settingsSection.value.disable("The settings section is disabled");
    } else if (settingsSection.value.isDisabled) {
      settingsSection.value.show();
    } else {
      settingsSection.value.hide();
    }
  }

  function triggerSnackbar() {
    snackbar.showMessage("This is a test message");
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
        <v-btn variant="flat" @click="toggleSection">Toggle Settings Section</v-btn>
        <v-btn variant="flat" @click="triggerSnackbar">Trigger snackbar</v-btn>
      </v-card-actions>
    </v-card>
  </v-lazy>
</template>
