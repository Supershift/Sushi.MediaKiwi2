<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import { ref } from "vue";

  // inject dependencies
  const { i18next } = useI18next();

  // define values
  const languages = ref(["en", "nl"]);

  // define events
  async function changeLanguage(value: string) {
    await i18next.value.changeLanguage(value);
  }
</script>

<template>
  <v-select :model-value="i18next.resolvedLanguage" :items="languages" @update:model-value="changeLanguage"></v-select>
</template>
