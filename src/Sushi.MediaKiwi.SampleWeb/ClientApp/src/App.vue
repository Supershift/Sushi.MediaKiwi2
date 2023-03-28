<script setup lang="ts">
  import { MkNavigation, MkScreen, MkNavigationIcon, MkSignOutButton, MkThemeToggle } from "@supershift/mediakiwi-vue";
  import { fetchSettings } from "./services/settings";

  async function getSettings() {
    const settings = await fetchSettings();
    console.log("settings:", settings);
  }

  getSettings();
</script>

<template>
  <v-card>
    <v-layout :full-height="true" class="mk-layout">
      <v-app-bar>
        <mk-navigation-icon />
        <v-toolbar-title>MediaKiwi 2.0 Sample</v-toolbar-title>
        <mk-theme-toggle></mk-theme-toggle>
        <mk-sign-out-button></mk-sign-out-button>
      </v-app-bar>
      <Suspense>
        <template #default>
          <mk-navigation></mk-navigation>
        </template>
        <template #fallback> Loading... </template>
      </Suspense>
      <mk-screen></mk-screen>
    </v-layout>
  </v-card>
</template>
