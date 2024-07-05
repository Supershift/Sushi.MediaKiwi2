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

  const { signIn } = useMediakiwiVueOptions();

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
  const image = computed(() => signIn?.image);
  const color = computed(() => signIn?.color);

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
      if (image.value) return { ...baseBgImageStyle, backgroundImage: `url(${image.value})` };
      if (color.value) return { backgroundColor: `${color.value}`, height: "100%" };
    }
    return { height: "100%" };
  });
</script>
<template>
  <div id="mk-signin-bg" class="mk-signin__bg" :style="styles">
    <MkSignIn v-if="!isAuthenticated" class="mk-view--signin">
      <template #main>
        {{ t("Main") }}
      </template>
      <template #footer>
        {{ t("Footer") }}
      </template>
    </MkSignIn>
  </div>
</template>
