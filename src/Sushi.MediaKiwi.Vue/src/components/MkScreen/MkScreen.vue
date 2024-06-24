<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
  import { useMediakiwiVueOptions } from "@/composables/useMediakiwiVueOptions";
  import { useNavigation } from "@/composables/useNavigation";
  import { computed } from "vue";

  const { signIn } = useMediakiwiVueOptions();
  const navigation = useNavigation();

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
  <v-main>
    <div id="mk-bg-image" :style="styles">
      <mk-breadcrumbs :sticky="true" />
      <div class="pa-4 pa-md-10 pt-md-4 mk-screen">
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
  }
</style>
