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

  function textFieldChanged(selectedValue: string) {
    emit("update:modelValue", { title: selectedValue, value: selectedValue });
  }

  const value = ref(props.modelValue?.value);
</script>

<template>
  <v-text-field v-model="value" @update:model-value="textFieldChanged" label="Value"> </v-text-field>
</template>
