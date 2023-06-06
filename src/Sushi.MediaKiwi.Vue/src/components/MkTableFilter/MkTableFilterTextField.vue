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
  const { t } = await useI18next();

  function textFieldChanged(selectedValue: string) {
    emit("update:modelValue", { title: selectedValue, value: selectedValue });
  }

  const value = ref(props.modelValue?.value);
</script>

<template>
  <v-text-field v-model="value" @update:model-value="textFieldChanged" :label="t('Value')"> </v-text-field>
</template>
