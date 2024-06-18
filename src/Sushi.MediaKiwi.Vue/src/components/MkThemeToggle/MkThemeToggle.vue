<script setup lang="ts">
  import { useTheme } from "vuetify";
  import { computed } from "vue";
  import { IconsLibrary } from "@/models";
  import { useI18next } from "@/composables";
  import { storeTheme } from "@/plugins/vuetify/themes/ThemeProvider";
  import { useKonamiCode } from "@/composables/useKonamiCode";

  const theme = useTheme();
  const { t } = await useI18next();
  useKonamiCode(activateCheats);

  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
    storeTheme(theme.global.name.value);
    document.querySelector("body")!.classList.toggle("retro", theme.global.name.value === "retro");
  }

  const icon = computed(() => (theme.global.current.value?.dark ? IconsLibrary.weatherSunny : IconsLibrary.weatherNight));

  function activateCheats() {
    theme.global.name.value = "retro";
    document.querySelector("body")!.classList.toggle("retro", theme.global.name.value === "retro");
  }
</script>

<template>
  <v-btn :icon="icon" :title="t('Switch appearance')" @click="toggleTheme" />
</template>
<style lang="scss">
  body.retro {
    .v-navigation-drawer.bg-background,
    .v-app-bar.v-toolbar {
      background-color: rgb(var(--v-theme-on-surface)) !important;
      color: rgb(var(--v-theme-surface)) !important;
    }

    .v-navigation-drawer {
      + .v-navigation-drawer {
        border-radius: 0 !important;
        background-color: #4e5862 !important;
        color: rgb(var(--v-theme-surface)) !important;
      }
    }
  }
</style>
