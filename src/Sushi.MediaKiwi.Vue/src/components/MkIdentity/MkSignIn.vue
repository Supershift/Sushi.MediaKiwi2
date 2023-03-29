<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { identity } from "@/identity";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";

  const { instance } = useMsal();

  const useRedirect = true;

  function login() {
    if (useRedirect) instance.loginRedirect({ scopes: identity.scopes, redirectStartPage: "/home" });
    else instance.loginPopup({ scopes: identity.scopes });
  }

  const isAuthenticated = useIsAuthenticated();
</script>
<template>
  <v-card>
    Are you authenticated? {{ isAuthenticated }}<br />
    <v-btn @click="login">Sign in</v-btn><br />
  </v-card>
</template>
