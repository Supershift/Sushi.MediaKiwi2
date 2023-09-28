<script setup lang="ts">
  import { MkNavigation, MkScreen, MkNavigationIcon, MkThemeToggle, MkAvatar, MkSuspense } from "@/components";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { MediakiwiVueOptions } from "@/models";
  import { useSnackbarStore } from "@/stores/snackbar";
  import { inject } from "vue";
  const mediakiwi = inject("mediakiwi") as MediakiwiVueOptions;

  // inject dependencies
  const isAuthenticated = useIsAuthenticated();
  const snackbar = useSnackbarStore();
</script>
<template>
  <v-card>
    <v-layout :full-height="true" class="mk-layout">
      <mk-suspense>
        <v-app-bar>
          <mk-navigation-icon />
          <v-toolbar-title v-if="isAuthenticated">{{ mediakiwi.title }}</v-toolbar-title>
          <v-spacer v-else></v-spacer>
          <mk-theme-toggle></mk-theme-toggle>
          <mk-avatar></mk-avatar>
        </v-app-bar>
      </mk-suspense>
      <mk-suspense>
        <mk-navigation v-if="isAuthenticated"></mk-navigation>
      </mk-suspense>
      <mk-screen></mk-screen>
      <v-snackbar v-model="snackbar.show">{{ snackbar.message }}</v-snackbar>
    </v-layout>
  </v-card>
</template>
