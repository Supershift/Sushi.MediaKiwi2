<script setup lang="ts">
  import { useBreadcrumbs, useNavigation } from "@/composables";
  import { IconsLibrary } from "@/models";
  import { NavigationItem } from "@/models/navigation";
  import { useRouter } from "@/router";
  import { computed, onBeforeUnmount, ref } from "vue";

  //  inject dependencies
  const navigation = useNavigation();
  const router = useRouter();
  const { clearCustomPageTitle } = useBreadcrumbs();

  // define props
  const props = defineProps<{
    item: NavigationItem;
    index: Number;
    isCurrentItem: boolean;
    isOnlyItem: boolean;
  }>();

  const hasComponentKey = computed(() => !!props.item?.componentKey);

  const customBreadcrumbLabel = ref<string | null>(null);
  const displayBreadcrumbLabel = computed(() => {
    return customBreadcrumbLabel.value ? customBreadcrumbLabel.value : props.item.breadcrumbLabel || props.item.name;
  });

  // called to send user to target screen
  function onItemClick() {
    if (hasComponentKey.value) {
      navigation.navigateTo(props.item);
    }
    return false;
  }

  async function tryGetBreadcrumbName() {
    setTimeout(async () => {
      try {
        // if the item has a getBreadcrumbLabel function, call it to get the breadcrumb label
        if (props.item.getBreadcrumbLabelCallback && !props.item.breadcrumbLabel) {
          const result = await props.item.getBreadcrumbLabelCallback(navigation.currentViewParameter.value);
          if (result) {
            customBreadcrumbLabel.value = result;
          }
        }
      } catch (error) {
        // silent error
        console.error(error);
      }
    });
  }

  onBeforeUnmount(() => {
    // When the component is destroyed, clear the custom page title
    clearCustomPageTitle(props.item);
  });

  tryGetBreadcrumbName();
</script>
<template>
  <li v-if="index" class="v-breadcrumbs-divider">
    <v-icon :icon="IconsLibrary.chevronRight" />
  </li>

  <v-btn
    :active="isCurrentItem"
    :disabled="isCurrentItem"
    class="text-title-large text-container"
    :class="{ 'text-truncate d-inline-block': !isCurrentItem, 'pl-2': isCurrentItem && isOnlyItem }"
    size="unset"
    :title="displayBreadcrumbLabel"
    @click.stop="onItemClick"
  >
    {{ displayBreadcrumbLabel }}
  </v-btn>
</template>
