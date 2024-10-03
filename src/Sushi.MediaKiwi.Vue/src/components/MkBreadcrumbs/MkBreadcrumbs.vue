<script setup lang="ts">
  import { computed } from "vue";
  import MkBackButton from "@/components/MkNavigation/MkBackButton.vue";
  import { useDisplay } from "vuetify";
  import { useNavigation } from "@/composables/useNavigation";
  import { IconsLibrary } from "@/models";
  import { useBreadcrumbs } from "@/composables/useBreadcrumbs";
  import { NavigationItem } from "@/models/navigation";

  // define props
  const props = defineProps({
    /** Determines if the breadcrumbs become sticky at the top of the page, default: false */
    sticky: {
      type: Boolean,
      default: false,
    },
  });

  // inject dependencies
  const { xs } = useDisplay();
  const navigation = useNavigation();
  const { customPageTitle, setCustomPageTitle } = useBreadcrumbs();

  // determine if we show the whole breadcrumb or only a back button
  const showBackButton = computed(() => xs.value && breadcrumbs.value.length > 1);

  // go up the navigation tree starting from the current item
  const breadcrumbs = computed(() => {
    const currentItem = navigation.currentNavigationItem.value;
    const result: Array<NavigationItem> = [];
    let candidate: NavigationItem | undefined = { ...currentItem };
    while (candidate) {
      result.unshift(candidate);
      candidate = candidate.parent;
    }

    // Alter the title of the last item in the collection
    if (customPageTitle.value && result && result[result.length - 1]) {
      result[result.length - 1].name = customPageTitle.value ?? result[result.length - 1].name;
    }

    // Reset the custom title
    setCustomPageTitle();

    return result;
  });

  /** Return if the item is the last in the collection */
  function isCurrentItem(index: number): boolean {
    return index === breadcrumbs.value.length - 1;
  }

  function hasScreen(item: NavigationItem): boolean {
    if (item?.componentKey) {
      return true;
    }
    return false;
  }

  // called to send user to target screen
  function onItemClick(item: NavigationItem) {
    if (item.componentKey) {
      navigation.navigateTo(item);
    }
    return false;
  }

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
        <template v-for="(item, index) in breadcrumbs" :key="item.id">
          <li v-if="index" class="v-breadcrumbs-divider">
            <v-icon :icon="IconsLibrary.chevronRight" />
          </li>

          <v-btn
            :active="isCurrentItem(index)"
            :disabled="isCurrentItem(index)"
            class="text-title-large text-container"
            :class="{ 'text-truncate d-inline-block': !isCurrentItem(index), 'pl-2': isCurrentItem(index) && breadcrumbs?.length === 1 }"
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
