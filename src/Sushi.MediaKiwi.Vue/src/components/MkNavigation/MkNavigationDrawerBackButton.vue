<script setup lang="ts">
  import { useMediakiwiStore } from "@/stores";
  import { useNavigation } from "@/composables/useNavigation";
  import { IconsLibrary } from "@/models";
  import { useRouter } from "@/router";
  import { computed, ref } from "vue";
  import { useBreadcrumbs } from "@/composables";
  import { watch } from "vue";

  const navigation = useNavigation(); // also calls store within this composable
  const { getBreadcrumbLabel, getItemChild } = useBreadcrumbs(); // also calls store within this composable
  const router = useRouter();
  const store = useMediakiwiStore();

  const navigate = () => {
    if (store.navigationBackUrlOverwrite) {
      const overwrite = store.navigationBackUrlOverwrite;
      store.navigationBackUrlOverwrite = undefined;

      router.push(overwrite);
    } else if (navigation.currentRootItem.value) {
      navigation.navigateTo(navigation.currentRootItem.value);
    }
  };

  const currentRootItemId = computed(() => navigation.currentRootItem.value?.id || "-1");

  const customBreadcrumbLabel = ref<string | null>(null);
  const displayBreadcrumbLabel = computed(() => {
    return customBreadcrumbLabel.value
      ? customBreadcrumbLabel.value
      : navigation.currentRootItem.value?.breadcrumbLabel || navigation.currentRootItem.value?.name;
  });

  async function load() {
    // Try to get the breadcrumb name
    if (navigation.currentRootItem.value) {
      // Clear the custom breadcrumb label
      customBreadcrumbLabel.value = "";

      // Get the current root item
      let item = { ...navigation.currentRootItem.value };

      // get the item child of our parent, this provides us with the breadcrumb label
      const parentChild = getItemChild(navigation.currentRootItem.value?.parent);
      if (parentChild) {
        item = { ...parentChild };
      }

      // Get the breadcrumb label
      const result = await getBreadcrumbLabel(item);
      if (result) {
        // Set the custom breadcrumb label
        customBreadcrumbLabel.value = result;
      }
    }
  }

  watch(
    () => currentRootItemId.value,
    () => {
      load();
    }
  );
  load();
</script>
<template>
  <v-list-item :title="displayBreadcrumbLabel" exact rounded="pill" class="mb-2" :prepend-icon="IconsLibrary.arrowLeft" @click.stop="navigate" />
</template>
