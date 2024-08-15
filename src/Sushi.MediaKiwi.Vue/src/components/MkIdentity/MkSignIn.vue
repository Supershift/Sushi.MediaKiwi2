<script setup lang="ts">
  import { useMsal } from "@/composables/useMsal";
  import { identity } from "@/identity";
  import { IconsLibrary } from "@/models";
  import { useI18next } from "@/composables/useI18next";
  import { computed, reactive } from "vue";

  // inject dependencies
  const { t } = await useI18next("MkSignIn");
  const { instance } = useMsal();

  function login() {
    instance.loginRedirect({ scopes: identity.scopes });
  }

  const props = withDefaults(
    defineProps<{
      title?: string;
      signInText?: string;
      icon?: IconsLibrary;
      width?: string;
    }>(),
    {
      title: undefined,
      signInText: undefined,
      width: "380px",
      onClick: undefined,
    }
  );

  // variables
  // title
  const defaultTitle = t.value("title", "Login");
  const title = computed(() => props.title ?? defaultTitle);
  // siginin button text
  const defaultSigninButtonText = t.value("SignInMicrosoft", "Continue with Microsoft");
  const signinButtonText = computed(() => props.signInText ?? defaultSigninButtonText);
  // singinIcon
  const defaultIcon = IconsLibrary.microsoftAzure.toString();
  const singinIcon = computed(() => props.icon ?? defaultIcon);
  // state
  const state = reactive({
    title: <string | undefined>title.value,
    signinButtonText: <string | undefined>signinButtonText.value,
    singinIcon: <string | undefined>singinIcon.value,
  });

  // define slots
  const slots = defineSlots<{
    main?: (props: unknown) => never;
    media?: (props: unknown) => never;
    actions?: (props: unknown) => never;
    footer?: (props: unknown) => never;
  }>();
</script>
<template>
  <v-container class="mk-signin fill-height">
    <v-row class="d-flex justify-sm-space-evenly">
      <v-col class="d-flex align-center justify-center" xs="12" sm="10" md="8" lg="4">
        <v-card class="mk-signin__card pa-5 text-center" rounded="lg" elevation="3" :width="props.width" v-bind="$attrs">
          <v-card-title tag="h1" class="text-headline-large" :title="state.title">{{ state.title }}</v-card-title>
          <v-divider class="mt-5 mb-5 mx-5" />
          <v-spacer></v-spacer>
          <v-card-text v-if="slots.main">
            <slot name="main"></slot>
          </v-card-text>
          <slot v-if="slots?.media" name="media" />
          <v-card-actions flex="1">
            <slot v-if="slots?.actions" name="actions" />
            <!-- Continue with Microsoft -->
            <v-btn v-else variant="outlined" size="x-large" :prepend-icon="state.singinIcon" width="100%" @click="login()" v-bind="$attrs">
              {{ state.signinButtonText }}
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
