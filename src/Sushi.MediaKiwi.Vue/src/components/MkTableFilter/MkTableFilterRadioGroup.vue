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
  <v-radio-group v-model="value" @update:model-value="selectChanged" :hide-details="true">
    <v-radio v-for="option in tableFilterItem.options" :label="option.title" :value="option"></v-radio>
  </v-radio-group>
</template>
