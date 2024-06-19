<script setup lang="ts">
  import { useI18next } from "@/composables";
  import MkDialogCard from "../MkDialog/MkDialogCard.vue";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";

  // inject dependencies
  const { defaultT } = await useI18next();

  defineProps<{
    tableFilterItem: TableFilterItem;
    onClose: () => void;
    onApply: () => void;
  }>();

  // define slots
  const slots = defineSlots<{
    /** Slot to render the logo */
    default?: () => never;
    /** Slot to render the title the application, preferably v-toolbar-title */
    actions?: () => never;
  }>();

  const emit = defineEmits<{
    (e: "click:close"): void;
    (e: "click:apply"): void;
  }>();
</script>

<template>
  <v-card class="mk-table-filter__item" rounded="xl" variant="elevated" width="312">
    <v-card-title tag="h6" class="text-headline-small pa-6 ma-0"> {{ tableFilterItem.title }} </v-card-title>

    <v-card-text class="px-2 py-0">
      <v-divider />
      <slot name="default"></slot>
      <v-divider />
    </v-card-text>

    <v-card-actions class="px-4 pb-4">
      <v-spacer />
      <v-btn @click="onClose">{{ defaultT("Cancel") }}</v-btn>
      <slot v-if="slots.actions" name="actions"> </slot>
      <v-btn v-else @click="onApply">{{ defaultT("Apply") }}</v-btn>
    </v-card-actions>
  </v-card>
</template>
