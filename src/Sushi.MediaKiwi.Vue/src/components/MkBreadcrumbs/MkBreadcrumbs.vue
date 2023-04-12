<script setup lang="ts">
  import { computed } from "vue";
  import MkBackButton from "@/components/MkNavigation/MkBackButton.vue";
  import MkBreadcrumbsItem from "./MkBreadcrumbsItem.vue";
  import { useDisplay } from "vuetify";
  import { useNavigation } from "@/composables/useNavigation";
  import { NavigationItem } from "@/models";

  // inject dependencies
  const { mobile } = useDisplay();
  const navigation = useNavigation();

  // determine if we show the whole breadcrumb or only a back button
  const showBackButton = computed(() => mobile.value && breadcrumbs.value.length > 1);

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
</script>
<template>
  <v-card v-if="breadcrumbs?.length" class="ma-5">
    <div v-if="showBackButton" class="breadcrumb-title-container">
      <mk-back-button class="mr-5" />
      <div class="text-h3 d-inline-block">
        {{ navigation.currentNavigationItem.value?.name }}
      </div>
    </div>
    <div v-else>
      <v-breadcrumbs divider=" ">
        <mk-breadcrumbs-item v-for="item in breadcrumbs" :key="item.id" :item="item" :breadcrumbs="breadcrumbs" />
      </v-breadcrumbs>
    </div>
  </v-card>
</template>
<style lang="css">
  .breadcrumb-title-container {
    display: flex;
    align-items: center;
  }
</style>
