<script setup lang="ts">
  import MkDialogCard from "../MkDialog/MkDialogCard.vue";
  import { useI18next } from "@/composables/useI18next";
  import type { TableFilterItem, TableFilterValue } from "@/models/table";
  import { computed } from "vue";
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
  const model = ref<Array<string>>(props.modelValue?.value || []);

  function applyFilter() {
    // Find the titles for the selected values
    const titles =
      props.tableFilterItem?.options
        ?.filter((x) => model.value.includes(x.value))
        .map((x) => x.title)
        .join(", ") || "";

    emit("update:modelValue", {
      title: titles,
      value: model.value,
    });
  }
</script>

<template>
  <MkDialogCard :title="tableFilterItem.title" content-classes="pa-6" @click:close="() => emit('click:close')">
    <template #intro>
      <p>{{ t("Select Filter intro", "Please choose the correct item") }}</p>
    </template>
    <template #default>
      <template v-for="option in tableFilterItem.options" :key="option.value">
        <v-checkbox v-model="model" :value="option.value" :label="option.title" density="comfortable" hide-details />
      </template>
    </template>
    <template #actions>
      <v-btn @click="applyFilter">{{ defaultT("Apply") }}</v-btn>
    </template>
  </MkDialogCard>
</template>
