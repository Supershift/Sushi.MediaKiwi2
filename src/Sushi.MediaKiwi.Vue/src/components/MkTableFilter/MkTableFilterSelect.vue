<script setup lang="ts">
  import { useI18next } from "@/composables/useI18next";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { ref } from "vue";

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
    modelValue: TableFilterValue;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
  }>();

  // inject dependencies
  const { defaultT } = await useI18next();
  function selectChanged(selectedValue: TableFilterValue) {
    emit("update:modelValue", selectedValue);
  }

  const value = ref(props.modelValue);
</script>

<template>
  <v-autocomplete v-model="value" :items="tableFilterItem.options" :label="defaultT('Choose')" return-object @update:model-value="selectChanged">
  </v-autocomplete>
</template>
