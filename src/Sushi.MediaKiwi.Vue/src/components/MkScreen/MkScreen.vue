<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
  import { useErrorMessages } from "@/composables/useErrorMessages";
  import { useNavigation } from "@/composables/useNavigation";
  import { useSnackbarStore } from "@/stores";
  import { computed } from "vue";

  const navigation = useNavigation();
  const snackbar = useSnackbarStore();
  const { unexpectedErrorMessage } = await useErrorMessages();

  // Extend this in the future to include more pages?
  const isPageOnSignIn = computed(() => !navigation?.currentNavigationItem.value?.view?.id);

  const mkScreenClasses = computed(() => {
    return {
      "mk-screen": true,
      "pa-4": !isPageOnSignIn.value,
      "pa-md-10": !isPageOnSignIn.value,
      "pt-md-4": !isPageOnSignIn.value,
    };
  });
</script>

<template>
  <v-main>
    <mk-breadcrumbs :sticky="true" />
    <div :class="mkScreenClasses">
      <router-view v-slot="{ Component }">
        <suspense timeout="0">
          <template #default>
            <div class="mk-screen__content">
              <component :is="Component" :key="$route.path"></component>
            </div>
          </template>
          <template #fallback>
            <v-progress-circular indeterminate></v-progress-circular>
          </template>
        </suspense>
      </router-view>
    </div>
    <v-snackbar class="pa-0" v-model="snackbar.show">{{ snackbar.message || unexpectedErrorMessage }}</v-snackbar>
  </v-main>
</template>

<style lang="scss" scoped>
  .mk-screen {
    height: 100%;

    &__content {
      height: inherit;
    }
  }
</style>
