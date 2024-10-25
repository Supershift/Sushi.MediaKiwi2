<script setup lang="ts">
  import { computed, reactive, ref } from "vue";
  import MkBackButton from "@/components/MkNavigation/MkBackButton.vue";
  import { useNavigation } from "@/composables/useNavigation";
  import { useBreadcrumbs } from "@/composables/useBreadcrumbs";

  // inject dependencies
  const navigation = useNavigation();
  const { getBreadcrumbLabel } = useBreadcrumbs();

  const state = reactive({
    loading: false,
  });

  const customBreadcrumbLabel = ref<string | null>(null);
  const displayBreadcrumbLabel = computed(() => {
    return customBreadcrumbLabel.value
      ? customBreadcrumbLabel.value
      : navigation.currentNavigationItem.value?.breadcrumbLabel || navigation.currentNavigationItem.value?.name;
  });

  async function load() {
    // Try to get the breadcrumb name
    if (navigation.currentNavigationItem.value) {
      // Set loading state
      state.loading = true;
      const result = await getBreadcrumbLabel(navigation.currentNavigationItem.value);
      if (result) {
        // Set the custom breadcrumb label
        customBreadcrumbLabel.value = result;
      }

      // Clear loading state
      state.loading = false;
    }
  }

  load();
</script>
<template>
  <div class="breadcrumb-title-container">
    <mk-back-button />
    <div class="v-breadcrumbs-item text-title-large d-inline-block text-truncate">
      {{ displayBreadcrumbLabel }}
    </div>
  </div>
</template>
