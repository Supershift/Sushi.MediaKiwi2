<script setup lang="ts">
  import { computed } from "vue";
  import MkBackButton from "@/components/MkNavigation/MkBackButton.vue";
  import { useDisplay } from "vuetify";
  import { useNavigation } from "@/composables/useNavigation";
  import type { NavigationItem } from "@/models";

  // inject dependencies
  const { xs } = useDisplay();
  const navigation = useNavigation();
  // determine if we show the whole breadcrumb or only a back button
  const showBackButton = computed(() => xs.value && breadcrumbs.value.length > 1);

  // go up the navigation tree starting from the current item
  const breadcrumbs = computed(() => {
    const currentItem = navigation.currentNavigationItem.value;
    const result: Array<NavigationItem> = [];
    let candidate: NavigationItem | undefined = currentItem;
    while (candidate) {
      result.unshift(candidate);
      candidate = candidate.parent;
    }
    return result;
  });

  /** Return if the item is the last in the collection */
  function isCurrentItem(index: number): boolean {
    return index === breadcrumbs.value.length - 1;
  }

  function hasScreen(item: NavigationItem): boolean {
    if (item?.viewId) {
      return true;
    }
    return false;
  }

  // called to send user to target screen
  function onItemClick(item: NavigationItem) {
    if (item.viewId) {
      navigation.navigateTo(item);
    }
    return false;
  }
</script>
<template>
  <v-card v-if="breadcrumbs?.length" class="ml-0">
    <div v-if="showBackButton" class="breadcrumb-title-container">
      <mk-back-button class="mr-5" />
      <div class="v-breadcrumbs-item text-title-large d-inline-block text-truncate">
        {{ navigation.currentNavigationItem.value?.name }}
      </div>
    </div>
    <div v-else>
      <v-breadcrumbs class="v-breadcrumbs--mediakiwi px-0 pt-0" color="primary">
        <template v-for="(item, index) in breadcrumbs" :key="item.id">
          <li v-if="index" class="v-breadcrumbs-divider">
            <v-icon icon="mdi-chevron-right" />
          </li>

          <v-btn
            :active="isCurrentItem(index)"
            :disabled="isCurrentItem(index)"
            class="text-title-large text-container"
            :class="{ 'text-truncate d-inline-block': !isCurrentItem(index) }"
            size="unset"
            :title="item.name"
            @click.stop="hasScreen(item) ? onItemClick(item) : {}"
          >
            {{ item.name }}
          </v-btn>
        </template>
      </v-breadcrumbs>
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
  @use "sass:map";
  @use "vuetify/settings" as vuetify;

  @media #{map.get(vuetify.$display-breakpoints, "md-and-down")} {
    .breadcrumb-title-container {
      margin-bottom: 10px;
    }
  }

  .breadcrumb-title-container {
    display: flex;
    align-items: center;
  }
  .v-breadcrumbs--mediakiwi {
    justify-content: flex-start;

    .v-btn {
      &:not(.v-btn--active) {
        font-weight: 400;
      }
      &.v-btn--active {
        opacity: 1;
      }
    }

    .v-breadcrumbs-divider {
      padding: 0;

      .v-icon {
        font-size: 1.5em; // 16px * 1.5 = 24px
      }
    }
  }
</style>
