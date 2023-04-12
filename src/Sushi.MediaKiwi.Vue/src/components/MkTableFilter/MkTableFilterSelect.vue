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
  <v-select v-model="value" :items="tableFilterItem.options" label="Kies" return-object @update:model-value="selectChanged"> </v-select>
</template>
