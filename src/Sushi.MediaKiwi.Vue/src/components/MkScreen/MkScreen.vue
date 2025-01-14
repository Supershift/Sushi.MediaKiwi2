<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
  import { useNavigation } from "@/composables/useNavigation";
  import { useRoute } from "@/router";
  import { computed } from "vue";

  const navigation = useNavigation();
  const route = useRoute();

  // Extend this in the future to include more pages?
  const isPageOnSignIn = computed(() => !navigation?.currentNavigationItem.value?.componentKey);

  const mkScreenClasses = computed(() => {
    return {
      "mk-screen": true,
      "mk-screen__sign-in": isPageOnSignIn.value,
      "pa-4": !isPageOnSignIn.value,
      "pa-md-10": !isPageOnSignIn.value,
      "pt-md-4": !isPageOnSignIn.value,
    };
  });

  const mkLayoutClasses = computed(() => {
    if (route.meta?.layout) {
      return {
        "mk-layout": true,
        [<string>route.meta.layout]: true,
      };
    } else {
      return {
        "mk-layout": true,
      };
    }
  });
</script>

<template>
  <v-main>
    <mk-breadcrumbs :sticky="true" />
    <div :class="mkScreenClasses">
      <div :class="mkLayoutClasses">
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
    </div>
  </v-main>
</template>

<style lang="scss" scoped>
  .mk-screen {
    height: 100%;

    &__content {
      height: inherit;
    }
    .mk-layout {
      height: inherit;
    }
  }
</style>
