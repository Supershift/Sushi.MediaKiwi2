<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
</script>

<template>
  <v-main>
    <mk-breadcrumbs :sticky="true" />
    <div class="pa-4 pa-md-10 mk-screen">
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
  .v-main {
    overflow: auto;
  }
  .mk-screen {
    height: 100%;

    &__content {
      height: inherit;
    }
  }
</style>
