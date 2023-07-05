<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { identity } from "@/identity";
  import { useI18next } from "@/composables/useI18next";

  const { t } = await useI18next("MkSignIn");

  // inject dependencies
  const { instance } = useMsal();

  function login() {
    instance.loginRedirect({ scopes: identity.scopes });
  }
</script>
<template>
  <v-container class="mk-signin">
    <v-row justify="center" align="center">
      <v-col xs="12" sm="10" md="8" lg="4" xl="3" class="mk-signin__colu,m">
        <v-card class="mk-signin__card pa-5 text-center" rounded="lg" elevation="3">
          <v-card-title tag="h1" class="text-headline-large">MediaKiwi 2.0</v-card-title>
          <v-divider class="mt-5 mb-5 mx-5" />
          <v-spacer></v-spacer>
          <v-card-text>
            <slot name="main"></slot>
          </v-card-text>
          <v-card-actions flex="1">
            <!-- Continue with Microsoft -->
            <v-btn variant="outlined" size="x-large" prepend-icon="mdi-microsoft-azure" width="100%" @click="login">
              {{ t("SignInMicrosoft") }}
            </v-btn>
          </v-card-actions>
          <v-card-text>
            <slot name="footer"></slot>
          </v-card-text>
          <v-spacer></v-spacer>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style lang="scss" scoped>
  .mk-signin {
    height: inherit;

    .v-row,
    .v-col {
      height: inherit;
    }

    .mk-signin__card {
      height: 375px;
      max-height: calc(100% - 100px);
      background-color: rgb(var(--v-theme-surface1));
      height: inherit;
      display: flex;
      flex-direction: column;

      .v-card-text {
        flex: 0 1 auto;
      }
    }
  }
</style>
