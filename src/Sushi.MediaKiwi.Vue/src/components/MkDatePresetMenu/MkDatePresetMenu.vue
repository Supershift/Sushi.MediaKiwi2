<script setup lang="ts">
  import { useDatePresets } from "@/composables/useDatePresets";
  import { useI18next } from "@/composables/useI18next";
  import { DateRange } from "@/models/ranges";
  import { reactive } from "vue";
  import { MkDatePicker } from "../MkDatePicker";
  import dayjs from "dayjs";

  const props = withDefaults(
    defineProps<{
      /**
       * Collection of days representing days in the past
       * @example [7, 28, 90, 365]
       */
      days?: Array<number>;
      /**
       * Collection of months representing months in the past
       * Zero representing the current month
       * @example [0, 1, 2]
       */
      months?: number[];
      datePickerClass?: string;
      datePickerTitle?: string;
    }>(),
    {
      days: () => [7, 28, 90, 365],
      months: () => [0, 1, 2],
    }
  );

  const modelValue = defineModel<{ value: any[]; title?: string }>({ required: true });

  // Inject dependencies
  const { defaultT } = await useI18next("MkDatePresetMenu");
  const { presets, formatPreset } = await useDatePresets({
    dayPresets: props.days,
    monthPresets: props.months,
  });

  const state = reactive({
    datePicker: false,
    // Create proxy model to prevent direct mutation
    model: modelValue.value || { value: [] },
  });

  const emit = defineEmits<{
    (e: "click:close"): void;
  }>();

  function updateModelValue(value: DateRange): void;
  function updateModelValue(value: any[]): void;
  function updateModelValue(value: DateRange | any[]): void {
    let startDate: Date, endDate: Date, title: string;

    if (Array.isArray(value)) {
      // Deconstruct the array
      const [start, end] = value;

      // Create a new Date object with the UTC values for custom date ranges
      const startUTC = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
      const endUTC = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

      startDate = startUTC;
      endDate = endUTC;
      title = formatPreset(startDate, endDate);
    } else {
      // Deconstruct the DateRange
      const { start, end } = value;
      startDate = start;
      endDate = end;
      title = formatPreset(start, end);
    }

    // Set the value
    state.model.value = [startDate, endDate];

    // Set the title
    state.model.title = title;

    // Apply the changes
    apply();
  }

  function apply() {
    modelValue.value = state.model;
  }

  function openDatePicker() {
    state.datePicker = true;
  }

  function closeDatePicker() {
    state.datePicker = false;
  }

  /**
   * Compare the start date of the item with the start date of the model
   * @param item
   */
  function isSameStart(item: DateRange) {
    if (!state.model.value || !state.model.value[0]) {
      return false;
    }
    return dayjs(item.start).isSame(state.model.value[0], "day");
  }

  /**
   * Compare the end date of the item with the end date of the model
   * @param item
   */
  function isSameEnd(item: DateRange) {
    if (!state.model.value || !state.model.value[1]) {
      return false;
    }
    return dayjs(item.end).isSame(state.model.value[0], "day");
  }

  /**
   * Check if the item is selected. This is the case when the start and end date are the same
   * @param item
   */
  function isSelectedPresetItem(item: DateRange) {
    return isSameStart(item) && isSameEnd(item);
  }

  /**
   * Check if the custom item is selected. This is the case when the model has a value, but it is not in the presets
   */
  function isSelectedCustomItem() {
    return (
      state.model.value &&
      state.model.value[0] &&
      state.model.value[1] &&
      !presets.value.days?.some((x: DateRange) => isSelectedPresetItem(x)) &&
      !presets.value.months.some((x: DateRange) => isSelectedPresetItem(x))
    );
  }
</script>

<template>
  <v-list v-if="!state.datePicker">
    <v-list-item v-for="(item, i) in presets.days" :key="i" :active="isSelectedPresetItem(item)" @click="updateModelValue(item)">
      <v-list-item-title>{{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item v-for="(item, i) in presets.months" :key="i" :active="isSelectedPresetItem(item)" @click="updateModelValue(item)">
      <v-list-item-title> {{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item :active="isSelectedCustomItem()" @click="openDatePicker">
      <v-list-item-title> {{ defaultT("Custom") }}</v-list-item-title>
    </v-list-item>
  </v-list>
  <MkDatePicker
    v-else-if="state.datePicker"
    v-model="state.model.value"
    :class="datePickerClass"
    multiple
    @click:close="closeDatePicker"
    @update:model-value="updateModelValue"
    :title="datePickerTitle"
  />
</template>
