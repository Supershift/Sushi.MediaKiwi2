<script setup lang="ts">
  import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
  import MkBreadcrumbItem from "./MkBreadcrumbItem.vue";
  import { useNavigation } from "@/composables";
  import { computed } from "vue";

  // inject dependencies
  const { hasBreadcrumbs, breadcrumbs, showMobileBackButton, getBreadcrumbLabel } = useBreadcrumbs();
  const navigation = useNavigation();

  /** Returns the active breadcrumbs, excluding the groups. */
  const activeBreadcrumbs = computed(() => breadcrumbs.value.filter((item) => !item.isGroup));
</script>
<template>
  <v-card v-if="hasBreadcrumbs" :class="['breadcrumbs-container ml-0 pa-4 px-md-10 pb-0']">
    <div v-if="showMobileBackButton" class="breadcrumb-title-container">
      <mk-back-button />
      <div class="v-breadcrumbs-item text-title-large d-inline-block text-truncate">
        {{ getBreadcrumbLabel(navigation.currentNavigationItem.value) }}
      </div>
    </div>
    <div v-else>
      <v-breadcrumbs class="px-0 pt-0">
        <MkBreadcrumbItem
          v-for="(item, index) in activeBreadcrumbs"
          :key="item.id"
          :item="item"
          :index="index"
          :is-only-item="breadcrumbs.length === 1"
        ></MkBreadcrumbItem>
      </v-breadcrumbs>
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
  @use "sass:map";
  @use "vuetify/settings" as vuetify;
  @use "@/styles/abstracts";
  @use "@/styles/themes/variables";

  @media #{map.get(vuetify.$display-breakpoints, "md-and-down")} {
    .breadcrumb-title-container {
      margin-bottom: 10px;
    }
  }

  .breadcrumb-title-container {
    display: flex;
    align-items: center;
  }

  .breadcrumbs-container {
    background-color: inherit;
  }
</style>
