<script setup lang="ts">
  import { MkNavigation, MkScreen, MkNavigationIcon, MkThemeToggle, MkAccountMenu, MkSuspense } from "@/components";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { useSnackbarStore } from "@/stores/snackbar";
  import MkLogoLockup from "./MkLogoLockup.vue";

  // inject dependencies
  const isAuthenticated = useIsAuthenticated();
  const snackbar = useSnackbarStore();

  defineProps<{
    /** Hide the avatar in the Account overflow menu */
    hideAvatar?: boolean;
    /** Hide the app bar */
    hideAppBar?: boolean;
  }>();

  // define slots
  const slots = defineSlots<{
    /** Slot to render the logo */
    logo?: (props: unknown) => never;
    /** Slot to render the title the application, preferably v-toolbar-title */
    title?: (props: unknown) => never;
    /** Slot for a custom avatar */
    avatar?: () => never;
    /** Slot to override the body contents in the account menu */
    accountMenuHeader?: () => never;
    /** Slot to override the body contents in the account menu */
    accountMenu?: () => never;
    /** Slot to override the actions in the account menu */
    accountMenuActions?: () => never;
  }>();
</script>
<template>
  <v-card>
    <v-layout v-side-sheet :full-height="true" class="mk-layout">
      <mk-suspense>
        <v-app-bar v-if="!isAuthenticated && !hideAppBar">
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
          <mk-account-menu :hide-avatar="hideAvatar">
            <template v-if="slots.avatar" #avatar>
              <slot name="avatar"></slot>
            </template>
            <template v-if="slots.accountMenuHeader" #header>
              <slot name="accountMenuHeader"></slot>
            </template>
            <template v-if="slots.accountMenu" #default>
              <slot name="accountMenu"></slot>
            </template>
            <template v-if="slots.accountMenuActions" #actions>
              <slot name="accountMenuActions"></slot>
            </template>
          </mk-account-menu>
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
