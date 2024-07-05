<script setup lang="ts">
  import { MkSignIn } from "@/components";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { useNavigation } from "@/composables/useNavigation";
  import { useMsal } from "@/composables/useMsal";
  import { container } from "tsyringe";
  import { RouterManager } from "@/router/routerManager";
  import { useI18next } from "@/composables/useI18next";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";
  import { computed } from "vue";
  import { useTheme } from "vuetify";

  const { signIn } = useMediakiwiVueOptions();
  const theme = useTheme();

  // inject dependencies
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const routerManager = container.resolve<RouterManager>("RouterManager");
  // we need to manually set the view id, because this view is not part of the navigation
  const { t } = await useI18next("MkSignIn");
  // we could be coming back from an authentication redirect, so wait for authentication to complete
  await instance.handleRedirectPromise();

  // if already authenticated, redirect to home
  if (isAuthenticated.value) {
    // first wait for routermanager to initialize
    await routerManager.Initialize();

    const navigation = useNavigation();
    navigation.navigateToHome();
  }

  // computed properties
  const image = computed(() => (!theme.current.value?.dark ? signIn?.themes?.light?.image ?? signIn?.image : signIn?.themes?.dark?.image ?? signIn?.image)); // check if the theme is dark or light and use the appropriate image
  const color = computed(() => (!theme.current.value?.dark ? signIn?.themes?.light?.color ?? signIn?.color : signIn?.themes?.dark?.color ?? signIn?.color)); // check if the theme is dark or light and use the appropriate color

  // base style for if the background image configuration is set
  const baseBgImageStyle = {
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  // generate style based on the configuration
  const styles = computed(() => {
    if (!isAuthenticated.value) {
      if (image.value && color.value) return { backgroundColor: `${color.value}`, ...baseBgImageStyle, backgroundImage: `url(${image.value})`, height: "100%" }; // if both image and color are set, use the image as background but color beneath
      if (image.value) return { ...baseBgImageStyle, backgroundImage: `url(${image.value})` };
      if (color.value) return { backgroundColor: `${color.value}`, height: "100%" };
    }
    return { height: "100%" };
  });
</script>
<template>
  <v-lazy transition="fade-transition" height="100%" :options="{ threshold: 0.5 }">
    <div id="mk-signin-bg" class="mk-signin__bg lazy" :style="styles" v-cloak>
      <MkSignIn v-if="!isAuthenticated" class="mk-view--signin">
        <template #main>
          {{ t("Main") }}
        </template>
        <template #footer>
          {{ t("Footer") }}
        </template>
      </MkSignIn>
    </div>
  </v-lazy>
</template>
