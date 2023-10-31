<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { identity } from "@/identity";
  import { IconsLibrary } from "@/models";
  import { useI18next } from "@/composables/useI18next";

  // inject dependencies
  const { t } = await useI18next("MkSignIn");
  const { instance } = useMsal();

  // Define content
  const title = t.value("title", "Login");

  function login() {
    instance.loginRedirect({ scopes: identity.scopes });
  }

  // define slots
  const slots = defineSlots<{
    main?: (props: unknown) => never;
    footer?: (props: unknown) => never;
  }>();
</script>
<template>
  <v-container class="mk-signin">
    <v-row justify="center" align="center">
      <v-col xs="12" sm="10" md="8" lg="4" xl="3">
        <v-card class="mk-signin__card pa-5 text-center" rounded="lg" elevation="3">
          <v-card-title tag="h1" class="text-headline-large" :title="title">{{ title }}</v-card-title>
          <v-divider class="mt-5 mb-5 mx-5" />
          <v-spacer></v-spacer>
          <v-card-text v-if="slots.main">
            <slot name="main"></slot>
          </v-card-text>
          <v-card-actions flex="1">
            <!-- Continue with Microsoft -->
            <v-btn variant="outlined" size="x-large" :prepend-icon="IconsLibrary.microsoftAzure" width="100%" @click="login">
              {{ t("SignInMicrosoft") }}
            </v-btn>
          </v-card-actions>
          <v-card-text v-if="slots.footer">
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
      min-height: 375px;
      background-color: rgb(var(--v-theme-surface1));
      display: flex;
      flex-direction: column;

      .v-card-text {
        flex: 0 1 auto;
      }
    }
  }
</style>
