<script setup lang="ts">
  import { MkApplication } from "@supershift/mediakiwi-vue";
  import { fetchSettings } from "./services/settings";

  async function getSettings() {
    const settings = await fetchSettings();
    console.log("settings:", settings);
  }

  getSettings();
</script>

<template>
  <mk-application></mk-application>
</template>
