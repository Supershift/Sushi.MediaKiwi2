<script setup lang="ts">
  import { useBreadcrumbs, useNavigation } from "@/composables";
  import { IconsLibrary } from "@/models";
  import { NavigationItem } from "@/models/navigation";
  import { computed, ref } from "vue";

  //  inject dependencies
  const navigation = useNavigation();
  const { isCurrentNavigationItem } = useBreadcrumbs();

  // define props
  const props = defineProps<{
    item: NavigationItem;
    index: Number;
    isOnlyItem: boolean;
  }>();

  // define computed properties
  const hasComponentKey = computed(() => !!props.item?.componentKey);
  const isCurrentItem = computed(() => isCurrentNavigationItem(props.item));
  const displayBreadcrumbLabel = computed(() => {
    return props.item.breadcrumbLabel || props.item.name;
  });

  // called to send user to target screen
  function onItemClick() {
    if (hasComponentKey.value) {
      navigation.navigateTo(props.item);
    }
    return false;
  }
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
