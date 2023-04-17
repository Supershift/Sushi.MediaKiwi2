<script setup lang="ts">
  import { NavigationItem } from "@/models/";
  import { useRoute } from "@/router";

  const props = defineProps<{
    item: NavigationItem;
    breadcrumbs: Array<NavigationItem>;
  }>();

  const route = useRoute();
  // generates classes for the breadcrumb
  function classes(item: NavigationItem) {
    // if its not the current path or only item we should truncate
    return {
      " d-inline-block text-truncate ": props.breadcrumbs.length > 1 && item && item !== route.meta.navigationItem,
    };
  }

  function isCurrentItem(item: NavigationItem): boolean {
    return item === (route.meta.navigationItem as NavigationItem);
  }
</script>
<template>
  <div class="breadcrumb-item-container">
    <v-breadcrumbs-item
      :to="{ name: item.id.toString() }"
      :active="isCurrentItem(item)"
      :disabled="isCurrentItem(item)"
      active-class="active-crumb"
      class="text-h4 text-container"
      :class="classes(item)"
      :key="item.id"
    >
      {{ item.name }}
    </v-breadcrumbs-item>
  </div>
</template>
<style scoped lang="scss">
  .breadcrumb-item-container {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
  }
  .active-crumb,
  .active-crumb:hover {
    text-decoration: none;
    cursor: text;
    max-width: unset !important;
    color: rgba(var(--v-theme-on-background), var(--v-theme-surface-overlay-multiplier));
    opacity: 1;
  }
  .text-container {
    max-width: 500px;
  }
  @media (min-width: 600px) {
    .breadcrumb-item-container {
      &:not(:first-of-type) {
        .text-container {
          max-width: 25vw;
        }
      }
      &:first-of-type {
        .text-container {
          max-width: 20vw;
        }
      }
      &:last-of-type {
        max-width: 100%;
        white-space: nowrap;
      }
    }
  }
</style>
