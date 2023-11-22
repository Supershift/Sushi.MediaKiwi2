<script setup lang="ts">
  import MkDialogCard from "../MkDialog/MkDialogCard.vue";
  import { TableFilterItem, TableFilterValue } from "@/models";
  import { ref } from "vue";
  import { useI18next } from "@/composables";
  import { useLocale } from "vuetify";

  // inject dependencies
  const { i18next, defaultT, t, formatDate } = await useI18next();
  const { current } = useLocale();
  // TODO There needs to be a better way to set the locale through the custom i18n plugin
  current.value = i18next.value.language;

  const props = defineProps<{
    modelValue: TableFilterValue;
    tableFilterItem: TableFilterItem;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: TableFilterValue): void;
    (e: "click:close"): void;
  }>();

  // state
  const model = ref(props.modelValue?.value);

  function applyFilter() {
    emit("update:modelValue", {
      title: formatDate.value(model.value),
      value: model.value,
    });
  }
</script>

<template>
  <MkDialogCard hide-header remove-content-padding content-classes="py-2" @click:close="() => emit('click:close')">
    <template #default>
      <v-date-picker v-model="model" :title="t('DatePickerTitle', 'Select date')" :header="t('DatePickerHeader', 'Enter Date')"> </v-date-picker>
    </template>
    <template #actions>
      <v-btn @click="applyFilter">{{ defaultT("Apply") }}</v-btn>
    </template>
  </MkDialogCard>
</template>

<style>
  .mk-dialog-card__content {
    padding: 0;
  }
</style>
