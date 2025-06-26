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
      "px-4": !isPageOnSignIn.value,
      "px-md-10": !isPageOnSignIn.value,
      // "pt-md-4": !isPageOnSignIn.value,
    };
  });

  const mkLayoutClasses = computed(() => ({
    "mk-layout": true,
    "mk-layout__sign-in": isPageOnSignIn.value,
    [<string>route.meta?.layout]: !!route.meta?.layout,
  }));
</script>

<template>
  <v-main>
    <mk-breadcrumbs />
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
    &__sign-in {
      height: calc(100vh - var(--v-layout-top));
    }

    .mk-layout {
      &__sign-in {
        height: 100%;
      }

      .mk-screen {
        &__content {
          height: 100%;
        }
      }
    }
  }
</style>
