<script setup lang="ts">
  import MkDialogCard from "../MkDialog/MkDialogCard.vue";
  import { useI18next } from "@/composables/useI18next";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { ref } from "vue";

  // inject dependencies
  const { defaultT, t } = await useI18next();

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
    modelValue: TableFilterValue;
  }>();

  // state
  const model = ref(props.modelValue?.value);

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
    (e: "click:close"): void;
  }>();

  function applyFilter() {
    emit("update:modelValue", {
      title: model.value,
      value: model.value,
    });
  }
</script>

<template>
  <MkDialogCard :title="tableFilterItem.title" content-classes="pa-6" @click:close="() => emit('click:close')">
    <template #intro>
      <p>{{ t("Select Textfield intro", "Please choose the correct item") }}</p>
    </template>
    <template #default>
      <v-text-field v-model="model" :label="defaultT('Value')" hide-details> </v-text-field>
    </template>
    <template #actions>
      <v-btn @click="applyFilter">{{ defaultT("Apply") }}</v-btn>
    </template>
  </MkDialogCard>
</template>
