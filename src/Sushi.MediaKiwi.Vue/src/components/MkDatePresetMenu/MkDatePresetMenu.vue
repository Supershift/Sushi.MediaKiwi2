<script setup lang="ts">
  import { useDatePresets } from "@/composables/useDatePresets";
  import { useDayjs } from "@/composables/useDayjs";
  import { useI18next } from "@/composables/useI18next";
  import { DateRange } from "@/models/ranges";
  import { reactive } from "vue";
  import { MkDatePicker } from "../MkDatePicker";
  const { isSame } = useDayjs();

  const props = withDefaults(
    defineProps<{
      modelValue: { value: any[]; title: string };
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
    }>(),
    {
      days: () => [7, 28, 90, 365],
      months: () => [0, 1, 2],
    }
  );

  const { presets, formatPreset } = await useDatePresets({
    dayPresets: props.days,
    monthPresets: props.months,
  });
  const { formatMonth, t, defaultT, formatDate } = await useI18next("MkDatePresetMenu");
  const defaultLastXDays = "Last {{duration}} days";

  const state = reactive({
    datePicker: false,
    model: props.modelValue || { value: [] },
  });

  const emit = defineEmits<{
    (e: "update:modelValue", value: { value: any[]; title: string }): void;
    (e: "click:close"): void;
  }>();

  function updateModelValueFromMonth(item: DateRange) {
    state.model.value = [item.start, item.end];
    state.model.title = formatPreset(item.start, item.end);
    apply();
  }

  function updateModelValueFromDateRange(item: DateRange) {
    state.model.value = [item.start, item.end];
    state.model.title = formatPreset(item.start, item.end);
    apply();
  }

  function updateModelValueFromDateArray(item: any[]) {
    state.model.value = [...item];
    state.model.title = formatPreset(state.model.value);
    apply();
  }

  function apply() {
    emit("update:modelValue", state.model);
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
    return isSame.value(item.start, state.model.value[0], "day");
  }

  /**
   * Compare the end date of the item with the end date of the model
   * @param item
   */
  function isSameEnd(item: DateRange) {
    if (!state.model.value || !state.model.value[1]) {
      return false;
    }
    return isSame.value(item.end, state.model.value[1], "day");
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
    <v-list-item v-for="(item, i) in presets.days" :key="i" :active="isSelectedPresetItem(item)" @click="updateModelValueFromDateRange(item)">
      <v-list-item-title>{{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item v-for="(item, i) in presets.months" :key="i" :active="isSelectedPresetItem(item)" @click="updateModelValueFromMonth(item)">
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
    @update:model-value="updateModelValueFromDateArray"
  />
</template>
