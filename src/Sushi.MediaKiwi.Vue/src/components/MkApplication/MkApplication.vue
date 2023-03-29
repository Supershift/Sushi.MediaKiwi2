<script setup lang="ts">
  import { MkNavigation, MkScreen, MkNavigationIcon, MkSignOutButton, MkThemeToggle, MkAvatar } from "@/components";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";

  const isAuthenticated = useIsAuthenticated();
</script>
<template>
  <v-card>
    <v-layout :full-height="true" class="mk-layout">
      <v-app-bar>
        <mk-navigation-icon />
        <v-toolbar-title>MediaKiwi 2.0</v-toolbar-title>
        <mk-theme-toggle></mk-theme-toggle>
        <mk-avatar></mk-avatar>
        <mk-sign-out-button></mk-sign-out-button>
      </v-app-bar>
      <Suspense v-if="isAuthenticated">
        <template #default>
          <mk-navigation></mk-navigation>
        </template>
        <template #fallback>
          <span>Loading...</span>
        </template>
      </Suspense>
      <mk-screen></mk-screen>
    </v-layout>
  </v-card>
</template>
