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
  const { t } = useI18next();
  function selectChanged(selectedValue: TableFilterValue) {
    emit("update:modelValue", selectedValue);
  }

  const value = ref(props.modelValue);
</script>

<template>
  <v-select v-model="value" :items="tableFilterItem.options" :label="t('Choose')" return-object @update:model-value="selectChanged"> </v-select>
</template>
