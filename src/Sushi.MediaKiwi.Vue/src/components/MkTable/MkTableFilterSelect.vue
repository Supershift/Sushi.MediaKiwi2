<script setup lang="ts">
  import type { ITableFilterItem, ITableFilterValue } from "@/models/table";
  import { ref } from "vue";

  const props = defineProps<{
    tableFilterItem: ITableFilterItem;
    modelValue: ITableFilterValue;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: ITableFilterValue): void;
  }>();

  function selectChanged(selectedValue: ITableFilterValue) {
    emit("update:modelValue", selectedValue);
  }

  const value = ref(props.modelValue);
</script>

<template>
  <v-select v-model="value" :items="tableFilterItem.options" label="Kies" return-object @update:model-value="selectChanged"> </v-select>
</template>
