<script setup lang="ts">
  import MkSignIn from "@/components/MkIdentity/MkSignIn.vue";
  import { useIsAuthenticated } from "@/composables/useIsAuthenticated";
  import { useNavigation } from "@/composables/useNavigation";
  import { watch } from "vue";
  import { useMsal } from "@/composables/useMsal";
  import { container } from "tsyringe";
  import { RouterManager } from "@/router/routerManager";

  // inject dependencies
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const routerManager = container.resolve<RouterManager>("RouterManager");

  // we could be coming back from an authentication redirect, so wait for authentication to complete
  await instance.handleRedirectPromise();

  // if already authenticated, redirect to home
  if (isAuthenticated.value) {
    // first wait for routermanager to initialize
    await routerManager.Initialize();

    const navigation = useNavigation();
    navigation.navigateToHome();
  }
</script>
<template>
  <MkSignIn v-if="!isAuthenticated"></MkSignIn>
</template>
