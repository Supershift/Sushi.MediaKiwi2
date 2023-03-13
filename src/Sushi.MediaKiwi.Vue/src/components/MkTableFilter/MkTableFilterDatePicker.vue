<script setup lang="ts">
  /** Documentation: https://vue3datepicker.com/ */
  import VueDatePicker from "@vuepic/vue-datepicker";
  import "@vuepic/vue-datepicker/dist/main.css";
  import { useTheme } from "vuetify";
  import type { ITableFilterItem, ITableFilterValue } from "@/models/table";
  import { ref } from "vue";
  const theme = useTheme();

  const props = defineProps<{
    tableFilterItem: ITableFilterItem;
    modelValue: ITableFilterValue;
  }>();

  const emit = defineEmits<{
    (e: "update:modelValue", value: ITableFilterValue): void;
  }>();

  /**
   * @param selectedValue ISO 8601 date strings (YYYY-MM-DD)
   */
  function selectChanged(selectedValue: string) {
    emit("update:modelValue", { title: selectedValue, value: selectedValue });
  }

  // TODO Localize
  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

  const value = ref(props.modelValue?.value);
</script>

<template>
  <v-card class="px-5">
    <vue-date-picker
      v-model="value"
      model-type="yyyy-MM-dd"
      @update:model-value="selectChanged"
      :dark="theme.global.current.value.dark"
      :auto-apply="true"
      inline
      :day-names="dayNames"
      :enable-time-picker="false"
      :hide-offset-dates="true"
    >
      <template #arrow-left>
        <v-icon icon="mdi-chevron-left"></v-icon>
      </template>
      <template #arrow-right>
        <v-icon icon="mdi-chevron-right"></v-icon>
      </template>
    </vue-date-picker>
  </v-card>
</template>

<style>
  .dp__theme_light,
  .dp__theme_dark {
    --dp-background-color: rgb(var(--v-theme-background));
    --dp-text-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));

    --dp-hover-color: rgba(var(--v-theme-on-surface), var(--v-high-hover-opacity));
    --dp-hover-text-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
    --dp-hover-icon-color: rgb(var(--v-theme-primary));

    --dp-primary-color: rgb(var(--v-theme-primary));
    --dp-primary-text-color: rgba(var(--v-theme-background), var(--v-high-emphasis-opacity));

    --dp-secondary-color: rgb(var(--v-theme-secondary));

    --dp-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    --dp-menu-border-color: rgba(var(--v-border-color), var(--v-border-opacity));
    --dp-border-color-hover: gba(var(--v-border-color), var(--v-border-opacity));

    --dp-disabled-color: rgba(var(--v-theme-on-surface), var(--v-high-disabled-opacity));

    --dp-scroll-bar-background: rgb(var(--v-theme-background));
    --dp-scroll-bar-color: rgba(var(--v-theme-on-surface), var(--v-high-hover-opacity));

    --dp-success-color: rgb(var(--v-theme-primary));
    --dp-success-color-disabled: rgba(var(--v-theme-primary), var(--v-high-disabled-opacity));
    --dp-icon-color: rgb(var(--v-theme-primary));
    --dp-danger-color: rgb(var(--v-theme-error));
    --dp-highlight-color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));

    --dp-border-radius: var(--v-border-radius);
  }

  .dp__main {
    font-family: Roboto, sans-serif;
  }

  .dp__menu,
  .dp__menu:focus {
    border: unset;
  }

  .dp__calendar_header {
    font-weight: 300;
  }

  .dp__cell_inner {
    border-radius: 50%;
  }
</style>
