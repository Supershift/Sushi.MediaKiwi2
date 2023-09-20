<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
</script>

<template>
  <v-main id="main" style="min-height: 300px">
    <div class="pa-4 pa-md-10 mk-screen">
      <mk-breadcrumbs />
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
