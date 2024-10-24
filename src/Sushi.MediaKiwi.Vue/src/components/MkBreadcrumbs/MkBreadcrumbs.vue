<script setup lang="ts">
  import { computed } from "vue";
  import MkBackButton from "@/components/MkNavigation/MkBackButton.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
  import MkBreadcrumbsItem from "./MkBreadcrumbsItem.vue";

  // define props
  const props = defineProps({
    /** Determines if the breadcrumbs become sticky at the top of the page, default: false */
    sticky: {
      type: Boolean,
      default: false,
    },
  });

  // inject dependencies
  const navigation = useNavigation();
  const { breadcrumbs, showBackButton, isCurrentItem } = useBreadcrumbs();

  /** Check if the breadcrumbs have any items and if all have a name */
  const hasBreadcrumbs = computed(() => breadcrumbs.value.length && breadcrumbs.value.some((x) => x.name));
</script>
<template>
  <v-card v-if="hasBreadcrumbs" :class="['breadcrumbs-container ml-0 pa-4 pa-md-10 pb-0', { 'v-breadcrumbs--sticky': props.sticky }]">
    <div v-if="showBackButton" class="breadcrumb-title-container">
      <mk-back-button />
      <div class="v-breadcrumbs-item text-title-large d-inline-block text-truncate">
        {{ navigation.currentNavigationItem.value?.name }}
      </div>
    </div>
    <div v-else>
      <v-breadcrumbs class="px-0 pt-0">
        <MkBreadcrumbsItem
          v-for="(item, index) in breadcrumbs"
          :key="item.id"
          :item="item"
          :index="index"
          :is-current-item="isCurrentItem(item)"
          :is-only-item="breadcrumbs.length === 1"
        ></MkBreadcrumbsItem>
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
