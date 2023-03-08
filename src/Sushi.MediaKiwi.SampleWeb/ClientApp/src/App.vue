<script setup lang="ts">
  import { MkNavigation_1, MkScreen, MkNavigationIcon } from "@supershift/mediakiwi-vue";
  import ThemeToggle from "./components/theme/ThemeToggle.vue";
</script>

<template>
  <v-card>
    <v-layout :full-height="true" class="mk-layout">
      <v-app-bar>
        <mk-navigation-icon />
        <v-toolbar-title>MediaKiwi 2.0 Sample</v-toolbar-title>
        <theme-toggle />
      </v-app-bar>
      <mk-navigation_1></mk-navigation_1>
      <mk-screen></mk-screen>
    </v-layout>
  </v-card>
</template>
