<script setup lang="ts">
  import { MkNavigation, MkScreen, MkNavigationIcon, MkSignOutButton, MkThemeToggle, MkAvatar, MkSuspense } from "@/components";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";

  const isAuthenticated = useIsAuthenticated();
</script>
<template>
  <v-card>
    <v-layout id="mk-layout" :full-height="true" class="mk-layout">
      <v-app-bar>
        <mk-navigation-icon />
        <v-toolbar-title>MediaKiwi 2.0</v-toolbar-title>
        <mk-theme-toggle></mk-theme-toggle>
        <mk-avatar></mk-avatar>
        <mk-sign-out-button></mk-sign-out-button>
      </v-app-bar>
      <mk-suspense v-if="isAuthenticated">
        <mk-navigation></mk-navigation>
      </mk-suspense>
      <mk-screen></mk-screen>
    </v-layout>
  </v-card>
</template>
