<script setup lang="ts">
  import { MkSignIn } from "@/components";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { useNavigation } from "@/composables/useNavigation";
  import { useMsal } from "@/composables/useMsal";
  import { container } from "tsyringe";
  import { RouterManager } from "@/router/routerManager";
  import { useI18next } from "@/composables/useI18next";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";
  import { computed, ref, watch } from "vue";
  import { useTheme } from "vuetify";
  import { useColors } from "@/composables";

  // inject dependencies
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const routerManager = container.resolve<RouterManager>("RouterManager");
  const { signIn } = useMediakiwiVueOptions();
  const theme = useTheme();
  const { isCssColor } = useColors();
  // we need to manually set the view id, because this view is not part of the navigation
  const { t } = await useI18next("MkSignIn");
  // we could be coming back from an authentication redirect, so wait for authentication to complete
  await instance.handleRedirectPromise();

  // if already authenticated, redirect to home
  if (isAuthenticated.value) {
    // first wait for store and routermanager to initialize
    await routerManager.Initialize();

    const navigation = useNavigation();
    navigation.navigateToHome();
  }

  // variables - base style for if the background image configuration is set
  const baseBgImageStyle = {
    height: "100%",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  };

  // computed properties
  const currentThemeName = computed(() => theme.name.value || "");
  const currentSignInImage = computed(() => signIn?.[currentThemeName.value]?.image || "");
  const currentSignInColor = computed(() => signIn?.[currentThemeName.value]?.color || undefined); // check if the theme is dark or light and use the appropriate color

  // Generate style based on the configuration
  const styles = computed(() => {
    // Default style
    let styles = {
      height: "100%",
    };

    // If the user is not authenticated and the background color or image is set
    if (!isAuthenticated.value) {
      styles = {
        ...styles,
        // Get background color
        ...getBackgroundColor(),
        // Get background image
        ...getBackgroundImage(),
      };
    }

    // Return the styles
    return styles;
  });

  // Function to set background color
  function getBackgroundColor() {
    if (currentSignInColor.value) {
      if (isCssColor(currentSignInColor.value)) {
        return { backgroundColor: `${currentSignInColor.value}` };
      } else {
        return { backgroundColor: `rgb(var(--v-theme-${currentSignInColor.value}))` };
      }
    }
  }

  // Function to set background image
  function getBackgroundImage() {
    if (currentSignInImage.value) {
      return {
        ...baseBgImageStyle,
        backgroundImage: `url(${currentSignInImage.value})`,
      };
    }
  }

  // css classes
  const cssClasses = computed(() => {
    return {
      "mk-signin__bg": true,
      lazy: true,
      "bg-image": !!currentSignInImage.value,
    };
  });
</script>
<template>
  <v-lazy transition="fade-transition" height="100%" :options="{ threshold: 0.5 }">
    <div id="mk-signin-bg" :class="cssClasses" :style="styles" v-cloak>
      <MkSignIn v-if="!isAuthenticated" class="mk-view--signin" :color="!isCssColor(currentSignInColor) ? currentSignInColor : undefined">
        <template #main>
          {{ t("Main", "") }}
        </template>
        <template #footer>
          {{ t("Footer", "") }}
        </template>
      </MkSignIn>
    </div>
  </v-lazy>
</template>
