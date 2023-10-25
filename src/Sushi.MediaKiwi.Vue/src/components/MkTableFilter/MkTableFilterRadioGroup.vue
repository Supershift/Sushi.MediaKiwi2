<script setup lang="ts">
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { ref } from "vue";

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
    modelValue: TableFilterValue;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
  }>();

  function selectChanged(selectedValue: TableFilterValue) {
    emit("update:modelValue", selectedValue);
  }

  const value = ref(props.modelValue);
</script>

<template>
  <v-radio-group v-model="value" hide-details @update:model-value="selectChanged">
    <v-radio v-for="(option, index) in tableFilterItem.options" :key="index" :label="option.title" :value="option"></v-radio>
  </v-radio-group>
</template>
