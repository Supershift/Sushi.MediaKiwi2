<script setup lang="ts">
  import { useDatePresets } from "@/composables/useDatePresets";
  import { useDayjs } from "@/composables/useDayjs";
  import { useI18next } from "@/composables/useI18next";
  import { DateRange, TitledDateRange } from "@/models/ranges";
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
      /**
       * CSS Class to apply to the date picker
       */
      datePickerClass?: string;
      /**
       * Title to display in the date picker
       */
      datePickerTitle?: string;
      /**
       * Custom date ranges
       * @example [{ title: "Last 7 days", start: new Date(), end: new Date() }]
       */
      customOptions?: Array<TitledDateRange>;
    }>(),
    {
      days: () => [7, 28, 90, 365],
      months: () => [0, 1, 2],
    }
  );

  const modelValue = defineModel<{ value: any[]; title?: string }>({ required: true });

  // Inject dependencies
  const { isSame, isBefore, startOf, endOf } = useDayjs();
  const { defaultT } = await useI18next("MkDatePresetMenu");
  const { presets, formatPreset, formatDateRange } = await useDatePresets({
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

  function updateDateArray(value: Date[]): void {
    let [date1, date2] = value;

    if (isBefore.value(date2, date1)) {
      [date1, date2] = [date2, date1];
    }

    const startDate = startOf.value(date1, "day");
    const endDate = endOf.value(date2, "day");
    const title = formatDateRange(startDate, endDate);
    apply([startDate, endDate], title);
  }

  function updateDateRange(value: DateRange): void {
    const title = formatPreset(value.start, value.end);
    apply([value.start, value.end], title);
  }

  function updateTitledDateRange(value: TitledDateRange): void {
    const title = formatDateRange(value.start, value.end, value.title);
    apply([value.start, value.end], title);
  }

  function apply(range: Date[], title: string) {
    state.model.value = range;
    state.model.title = title;
    modelValue.value = { ...state.model };
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
  function isSameStart(item: DateRange | TitledDateRange) {
    if (!state.model.value || !state.model.value[0]) {
      return false;
    }
    return isSame.value(item.start, state.model.value[0], "day");
  }

  /**
   * Compare the end date of the item with the end date of the model
   * @param item
   */
  function isSameEnd(item: DateRange | TitledDateRange) {
    if (!state.model.value || !state.model.value[1]) {
      return false;
    }
    return isSame.value(item.end, state.model.value[1], "day");
  }

  /**
   * Check if the item is selected. This is the case when the start and end date are the same
   * @param item
   */
  function isSelectedPresetItem(item: DateRange | TitledDateRange) {
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
      !presets.value.months.some((x: DateRange) => isSelectedPresetItem(x)) &&
      !props.customOptions?.some((x: DateRange) => isSelectedPresetItem(x))
    );
  }
</script>

<template>
  <v-list v-if="!state.datePicker">
    <v-list-item v-for="(item, i) in presets.days" :key="i" :active="isSelectedPresetItem(item)" @click="updateDateRange(item)">
      <v-list-item-title>{{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item v-for="(item, i) in presets.months" :key="i" :active="isSelectedPresetItem(item)" @click="updateDateRange(item)">
      <v-list-item-title> {{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider v-if="props.customOptions" />
    <v-list-item v-for="(item, i) in props.customOptions" :key="i" :active="isSelectedPresetItem(item)" @click="updateTitledDateRange(item)">
      <v-list-item-title> {{ formatDateRange(item.start, item.end, item.title) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item :active="isSelectedCustomItem()" @click="openDatePicker">
      <v-list-item-title> {{ defaultT("Custom") }}</v-list-item-title>
    </v-list-item>
  </v-list>
  <MkDatePicker
    v-else-if="state.datePicker"
    :modelValue="state.model.value"
    :class="datePickerClass"
    multiple
    @click:close="closeDatePicker"
    @update:model-value="updateDateArray"
    :title="datePickerTitle"
  />
</template>
