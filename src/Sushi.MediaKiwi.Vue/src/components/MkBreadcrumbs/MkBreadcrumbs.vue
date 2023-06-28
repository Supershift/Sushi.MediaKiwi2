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
</script>
<template>
  <v-card v-if="breadcrumbs?.length" class="ml-0">
    <div v-if="showBackButton" class="breadcrumb-title-container">
      <mk-back-button class="mr-5" />
      <div class="v-breadcrumbs-item text-h4 d-inline-block text-truncate">
        {{ navigation.currentNavigationItem.value?.name }}
      </div>
    </div>
    <div v-else>
      <v-breadcrumbs class="breadcrumbs-list-container px-0 pt-0">
        <template v-for="(item, index) in breadcrumbs" :key="item.id">
          <li v-if="index" class="v-breadcrumbs-divider">
            <v-icon icon="mdi-chevron-right" />
          </li>

          <v-breadcrumbs-item
            :to="item.viewId ? { name: item.id.toString() } : undefined"
            :active="isCurrentItem(index)"
            :disabled="isCurrentItem(index)"
            class="text-h4 text-container"
            :class="{ 'text-truncate d-inline-block': !isCurrentItem(index) }"
            :title="item.name"
          >
            <label :title="item.name">
              {{ item.name }}
            </label>
          </v-breadcrumbs-item>
        </template>
      </v-breadcrumbs>
    </div>
  </v-card>
</template>
<style lang="scss" scoped>
  .breadcrumb-title-container {
    display: flex;
    align-items: center;
  }

  .v-breadcrumbs-divider {
    .v-icon {
      font-size: 2.5em;
    }
  }

  .v-breadcrumbs-item {
    white-space: nowrap;

    label {
      cursor: inherit;
    }

    &:only-child {
      opacity: 1;
    }
  }
</style>
