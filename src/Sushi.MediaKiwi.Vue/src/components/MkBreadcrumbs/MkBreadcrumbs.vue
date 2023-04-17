<script setup lang="ts">
  import { computed } from "vue";
  import MkBackButton from "@/components/MkNavigation/MkBackButton.vue";
  import MkBreadcrumbsItem from "./MkBreadcrumbsItem.vue";
  import { useDisplay } from "vuetify";
  import { useNavigation } from "@/composables/useNavigation";
  import { NavigationItem } from "@/models";
  import { useSlots } from "vue";

  // inject dependencies
  const { mobile, xs } = useDisplay();
  const navigation = useNavigation();
  const slots = useSlots();
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
  console.log("here:", slots);
</script>
<template>
  <v-card v-if="breadcrumbs?.length" class="ma-5 ml-0">
    <div v-if="showBackButton" class="breadcrumb-title-container">
      <mk-back-button class="mr-5" />
      <div class="text-h4 d-inline-block">
        {{ navigation.currentNavigationItem.value?.name }}
      </div>
    </div>
    <div v-else>
      <v-breadcrumbs class="breadcrumbs-list-container" :items="breadcrumbs">
        <template #title="item">
          <mk-breadcrumbs-item :item="item.item" :breadcrumbs="breadcrumbs" />
        </template>
        <template #divider>
          <v-icon icon="mdi-chevron-right"></v-icon>
        </template>
      </v-breadcrumbs>
    </div>
  </v-card>
</template>
<style lang="scss">
  .breadcrumb-title-container {
    display: flex;
    align-items: center;
  }
  .breadcrumbs-list-container {
    .v-icon {
      font-size: 2.5em;
    }
  }
</style>
