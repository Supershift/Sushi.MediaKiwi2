<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { identity } from "@/identity";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";

  const { instance } = useMsal();
  const loginPopup = () => {
    instance.loginPopup({ scopes: identity.scopes });
  };

  const loginRedirect = () => {
    instance.loginRedirect({ scopes: identity.scopes });
  };

  const isAuthenticated = useIsAuthenticated();
</script>
<template>
  <v-card>
    Are you authenticated? {{ isAuthenticated }}<br />
    <v-btn @click="loginPopup">Sign in with pop-up</v-btn><br />
    <v-btn @click="loginRedirect">Sign in with redirect</v-btn><br />
  </v-card>
</template>
