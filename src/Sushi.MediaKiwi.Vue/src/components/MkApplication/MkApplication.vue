<script setup lang="ts">
  import { MkNavigation, MkScreen, MkNavigationIcon, MkSignOutButton, MkThemeToggle, MkAvatar, MkSuspense } from "@/components";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { useSnackbarStore } from "@/stores/snackbar";
  import MkLanguage from "../MkLanguage/MkLanguage.vue";
  const isAuthenticated = useIsAuthenticated();

  const snackbar = useSnackbarStore();

  import { Ref, ref, watch } from "vue";
  import { inject } from "vue";
  import { type i18n } from "i18next";

  // inject dependencies
  const i18next = inject<i18n>("i18next")!;

  const something = inject<any>("somethingReactive")!;
</script>
<template>
  <v-card :key="i18next.resolvedLanguage">
    <v-layout :full-height="true" class="mk-layout">
      <v-app-bar v-if="isAuthenticated">
        <mk-navigation-icon />
        <v-toolbar-title>MediaKiwi 2.0</v-toolbar-title>
        {{ i18next.resolvedLanguage }}
        {{ something.myProperty }}
        <mk-language></mk-language>
        <mk-theme-toggle></mk-theme-toggle>
        <mk-avatar></mk-avatar>
        <mk-sign-out-button></mk-sign-out-button>
      </v-app-bar>
      <mk-suspense>
        <mk-navigation v-if="isAuthenticated"></mk-navigation>
      </mk-suspense>
      <mk-screen></mk-screen>
      <v-snackbar v-model="snackbar.show">{{ snackbar.message }}</v-snackbar>
    </v-layout>
  </v-card>
</template>
