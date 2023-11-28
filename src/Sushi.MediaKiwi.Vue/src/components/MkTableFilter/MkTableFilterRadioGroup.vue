<script setup lang="ts">
  import MkDialogCard from "../MkDialog/MkDialogCard.vue";
  import { useI18next } from "@/composables";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { ref } from "vue";

  // inject dependencies
  const { defaultT, t } = await useI18next();

  const props = defineProps<{
    tableFilterItem: TableFilterItem;
    modelValue: TableFilterValue;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
    (e: "click:close"): void;
  }>();

  // state
  const model = ref(props.modelValue?.value);

  function applyFilter() {
    emit("update:modelValue", {
      title: model.value.title,
      value: model.value.value,
    });
  }
</script>

<template>
  <MkDialogCard :title="tableFilterItem.title" @click:close="() => emit('click:close')">
    <template #intro>
      <p>{{ t("Radio Filter intro", "Please choose the correct item") }}</p>
    </template>
    <template #default>
      <v-radio-group v-model="model" hide-details>
        <v-radio v-for="(option, index) in tableFilterItem.options" :key="index" :label="option.title" :value="option"></v-radio>
      </v-radio-group>
    </template>
    <template #actions>
      <v-btn @click="applyFilter">{{ defaultT("Apply") }}</v-btn>
    </template>
  </MkDialogCard>
</template>
