<script setup lang="ts">
  import { useNavigation } from "@/composables/useNavigation";
  import { useMediakiwiStore } from "@/stores";
  import { useI18next } from "@/composables/useI18next";
  import { IconsLibrary } from "@/models";

  // define properties
  const props = defineProps<{
    /** ExternalId of the view instance to which the user is pushed when clicking a row. */
    itemViewId?: string;
  }>();

  // inject dependencies
  const store = useMediakiwiStore();
  const navigation = useNavigation();
  const { defaultT } = await useI18next();

  function onNewClick() {
    // navigate user to target page if defined
    if (props.itemViewId) {
      // find navigation item for the view
      const view = store.views.find((x) => x.id == props.itemViewId);

      if (!view) {
        throw new Error(`No view found for external id ${props.itemViewId}`);
      }
      const navigationItem = store.navigationItems.find((x) => x.viewId == view?.id);
      if (!navigationItem) {
        throw new Error(`No navigationItem found for view ${props.itemViewId}`);
      }

      // push user to target page
      navigation.navigateTo(navigationItem, undefined);
    }
  }
</script>

<template>
  <v-btn-primary :prepend-icon="IconsLibrary.plus" @click="onNewClick">{{ defaultT("New item") }}</v-btn-primary>
</template>
