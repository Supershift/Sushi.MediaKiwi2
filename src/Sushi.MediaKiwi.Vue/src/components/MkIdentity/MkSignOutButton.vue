<script setup lang="ts">
  import { identity } from "@/identity";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { useI18next } from "@/composables/useI18next";

  // inject dependencies
  const { t } = await useI18next();
  const isAuthenticated = useIsAuthenticated();

  const logoutRedirect = () => {
    identity.msalInstance.logoutRedirect();
  };
</script>

<template>
  <v-btn @click="logoutRedirect" v-if="isAuthenticated">{{ t("Sign out") }}</v-btn>
</template>
