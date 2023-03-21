<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { identity } from "@/identity";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";

  const { instance, accounts } = useMsal();
  function loginPopup() {
    instance.loginPopup({ scopes: identity.scopes });
  }

  function loginRedirect() {
    instance.loginRedirect({ scopes: identity.scopes });
  }

  async function getToken() {
    console.log(accounts);
    if (accounts.value.length > 0) {
      const currentAccount = accounts.value[0];
      console.log("requesting for scopes:");
      console.log(identity.scopes);
      const response = await instance.acquireTokenSilent({ scopes: identity.scopes, account: currentAccount });
      console.log(response);
    } else {
      console.warn("no signed in account found");
    }
  }

  const isAuthenticated = useIsAuthenticated();
</script>
<template>
  <v-card>
    Are you authenticated? {{ isAuthenticated }}<br />
    <v-btn @click="loginPopup">Sign in with pop-up</v-btn><br />
    <v-btn @click="loginRedirect">Sign in with redirect</v-btn><br />
    <v-btn @click="getToken">Get access token</v-btn>
  </v-card>
</template>
