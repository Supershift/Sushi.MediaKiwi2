<script setup lang="ts">
  import { useTheme } from "vuetify";
  import { computed } from "vue";
  import { IconsLibrary } from "@/models";
  import { useI18next } from "@/composables";
  import { storeTheme } from "@/plugins/vuetify/themes/ThemeProvider";

  const theme = useTheme();
  const { t } = await useI18next();

  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
    storeTheme(theme.global.name.value);
  }

  const icon = computed(() => (theme.global.current.value.dark ? IconsLibrary.weatherSunny : IconsLibrary.weatherNight));
</script>

<template>
  <v-btn :icon="icon" :title="t('Switch appearance')" @click="toggleTheme" />
</template>
