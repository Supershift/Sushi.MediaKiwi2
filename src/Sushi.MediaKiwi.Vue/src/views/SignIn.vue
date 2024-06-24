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
  const navigation = useNavigation();

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

  const image = computed(() => signIn?.image);
  const color = computed(() => signIn?.color);

  const isPageOnSignIn = computed(() => !navigation?.currentNavigationItem.value?.view?.id);

  const styles = computed(() => {
    if (isPageOnSignIn.value && signIn?.image) {
      return {
        backgroundImage: image.value ? `url(${image.value})` : "",
        height: "100%",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      };
    } else if (color.value) {
      return {
        backgroundColor: color.value ? `${color.value}` : "",
      };
    }
    return undefined;
  });
</script>
<template>
  <div id="mk-bg-image d-flex align-center justify-center" :style="styles">
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
