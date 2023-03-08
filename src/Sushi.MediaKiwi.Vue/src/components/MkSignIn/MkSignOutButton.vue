<script setup lang="ts">
  import { identity } from "@/identity";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";

  const logoutPopup = () => {
    identity.msalInstance.logoutPopup({
      mainWindowRedirectUri: "/SignIn",
    });
  };
  const logoutRedirect = () => {
    identity.msalInstance.logoutRedirect();
  };

  const isAuthenticated = useIsAuthenticated();
</script>

<template>
  <v-btn @click="logoutRedirect" v-if="isAuthenticated">Sign out</v-btn>
</template>
