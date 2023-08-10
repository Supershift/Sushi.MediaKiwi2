<script setup lang="ts">
  import { useTheme } from "vuetify";
  import { computed } from "vue";
  import { IconsLibrary } from "@/models";

  const theme = useTheme();

  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? "light" : "dark";
  }

  const icon = computed(() => (theme.global.current.value.dark ? IconsLibrary.weatherSunny : IconsLibrary.weatherNight));
</script>

<template>
  <v-btn icon @click="toggleTheme" title="Switch appearance">
    <v-icon :icon="icon"></v-icon>
  </v-btn>
</template>
