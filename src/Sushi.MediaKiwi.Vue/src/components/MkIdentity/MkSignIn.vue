<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { identity } from "@/identity";

  // inject dependencies
  const { instance } = useMsal();

  function login() {
    instance.loginRedirect({ scopes: identity.scopes });
  }
</script>
<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col xs="12" sm="10" md="8" lg="4" xl="3">
        <v-card variant="tonal" class="pa-5 text-center">
          <v-card-title tag="h1">MediaKiwi 2.0</v-card-title>
          <v-divider class="mt-5 mb-5 mx-5" />
          <v-card-text>
            <slot name="main"></slot>
          </v-card-text>
          <v-card-actions>
            <v-btn size="x-large" prepend-icon="mdi-microsoft-azure" variant="flat" width="100%" @click="login">Azure Active Directory</v-btn>
          </v-card-actions>
          <v-card-text>
            <slot name="footer"></slot>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
  .v-container,
  .v-row {
    height: 100%;
  }

  h1 {
    font-size: revert;
  }
</style>
