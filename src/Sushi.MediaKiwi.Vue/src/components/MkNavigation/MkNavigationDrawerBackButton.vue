<script setup lang="ts">
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";
  import { IconsLibrary } from "@/models";
  import { useRouter } from "@/router";
  import { computed, ref } from "vue";
  import { useBreadcrumbs } from "@/composables";
  import { watch } from "vue";
  import { NavigationItem } from "@/models/navigation";

  const navigation = useNavigation(); // also calls store within this composable
  const { getEntityNavigationItem, getBreadcrumbLabel } = useBreadcrumbs(); // also calls store within this composable
  const router = useRouter();
  const store = useMediakiwiStore();

  // define computed properties
  const currentRootItemId = computed(() => navigation.currentRootItem.value?.id || "-1");
  const customCurrentRootItem = ref<NavigationItem | undefined>(undefined);

  const navigate = () => {
    if (store.navigationBackUrlOverwrite) {
      const overwrite = store.navigationBackUrlOverwrite;
      store.navigationBackUrlOverwrite = undefined;

      router.push(overwrite);
    } else if (customCurrentRootItem.value) {
      navigation.navigateTo(customCurrentRootItem.value);
    }
  };

  const displayBreadcrumbLabel = computed(() => getBreadcrumbLabel(customCurrentRootItem.value));

  function load() {
    // get the current root item
    customCurrentRootItem.value = navigation.currentRootItem.value;

    // if we have a parent, we can get the breadcrumb label from the parent's item child
    if (navigation.currentRootItem.value?.parent) {
      // get the item child of our parent, this provides us with the breadcrumb label
      const entityNavigationItem = getEntityNavigationItem(navigation.currentRootItem.value?.parent);

      if (entityNavigationItem) {
        customCurrentRootItem.value = entityNavigationItem;
      }
    }
  }

  watch(() => currentRootItemId.value, load);
  load();
</script>
<template>
  <v-list-item :title="displayBreadcrumbLabel" exact rounded="pill" class="mb-2" :prepend-icon="IconsLibrary.arrowLeft" @click.stop="navigate" />
</template>
