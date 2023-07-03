<script setup lang="ts">
  import { MkBreadcrumbs } from "@/components/MkBreadcrumbs/";
</script>

<template>
  <v-main id="main" style="min-height: 300px">
    <div class="pa-10">
      <mk-breadcrumbs />
      <router-view v-slot="{ Component }">
        <suspense timeout="0">
          <template #default>
            <div>
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
