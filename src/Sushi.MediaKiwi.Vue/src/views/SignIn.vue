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
  const currentThemeName = ref(theme.name.value || "");
  const currentSignInImage = ref(signIn?.[currentThemeName.value]?.image || "");
  const currentSignInColor = ref(signIn?.[currentThemeName.value]?.color || ""); // check if the theme is dark or light and use the appropriate color

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
      if (currentSignInImage.value && currentSignInColor.value)
        return { backgroundColor: `${currentSignInColor.value}`, ...baseBgImageStyle, backgroundImage: `url(${currentSignInImage.value})`, height: "100%" }; // if both image and color are set, use the image as background but color beneath
      if (currentSignInImage.value) return { ...baseBgImageStyle, backgroundImage: `url(${currentSignInImage.value})` };
      if (currentSignInColor.value) return { backgroundColor: `${currentSignInColor.value}`, height: "100%" };
    }
    return { height: "100%" };
  });

  // watchers
  watch(
    () => theme.name.value,
    (newVal) => {
      currentSignInImage.value = signIn?.[newVal]?.image || "";
      currentSignInColor.value = signIn?.[newVal]?.color || "";
    }
  );
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
