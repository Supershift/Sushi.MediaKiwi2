<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
  import { useI18next } from "@/composables";
  import { useNavigation } from "@/composables/useNavigation";
  import { registerErrorMessages } from "@/helpers/registerErrorHandler";
  import { computed } from "vue";

  const navigation = useNavigation();
  await registerErrorMessages(useI18next("errorMessages"), useI18next("formMessages"));

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
