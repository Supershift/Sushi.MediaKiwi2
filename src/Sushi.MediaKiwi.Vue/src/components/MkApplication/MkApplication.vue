<script setup lang="ts">
  import { MkNavigation, MkScreen, MkNavigationIcon, MkThemeToggle, MkAvatar, MkSuspense } from "@/components";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { useSnackbarStore } from "@/stores/snackbar";
  import MkLogoLockup from "./MkLogoLockup.vue";

  // inject dependencies
  const isAuthenticated = useIsAuthenticated();
  const snackbar = useSnackbarStore();

  // define slots
  const slots = defineSlots<{
    logo?: (props: unknown) => never;
    title?: (props: unknown) => never;
  }>();
</script>
<template>
  <v-card>
    <v-layout v-side-sheet :full-height="true" class="mk-layout">
      <mk-suspense>
        <v-app-bar>
          <mk-navigation-icon />
          <mk-logo-lockup>
            <template v-if="slots.logo" #logo>
              <slot name="logo"></slot>
            </template>
            <template v-if="slots.title" #title>
              <slot name="title"></slot>
            </template>
          </mk-logo-lockup>
          <v-spacer></v-spacer>
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
