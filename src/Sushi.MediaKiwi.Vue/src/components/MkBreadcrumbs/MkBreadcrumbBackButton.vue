<script setup lang="ts">
  import { computed } from "vue";
  import MkBackButton from "@/components/MkNavigation/MkBackButton.vue";
  import { useNavigation } from "@/composables/useNavigation";

  // inject dependencies
  const navigation = useNavigation();

  const displayBreadcrumbLabel = computed(() => {
    return navigation.currentNavigationItem.value?.breadcrumbLabel || navigation.currentNavigationItem.value?.name;
  });
</script>
<template>
  <div class="breadcrumb-title-container">
    <mk-back-button />
    <div class="v-breadcrumbs-item text-title-large d-inline-block text-truncate">
      {{ displayBreadcrumbLabel }}
    </div>
  </div>
</template>
