<script setup lang="ts">
  import { useDatePresets } from "@/composables/useDatePresets";
  import { useDayjs } from "@/composables/useDayjs";
  import { useI18next } from "@/composables/useI18next";
  import { DateRange } from "@/models/ranges";
  import { reactive } from "vue";
  import { MkDatePicker } from "../MkDatePicker";
  import dayjs from "dayjs";

  // threshold date for the forever date, when the date is before this date, it is considered forever
  let foreverDateThreshold = new Date("01-01-1900");

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
      hasForever?: boolean;
      foreverLabel?: string;
      foreverThreshold?: string; // date string
    }>(),
    {
      days: () => [7, 28, 90, 365],
      months: () => [0, 1, 2],
    }
  );

  const modelValue = defineModel<{ value: any[]; title?: string }>({ required: true });
  // copy the initial model value to prevent direct mutation
  const initialModel = { ...modelValue.value };
  // Set the threshold date for the forever date
  if (props?.foreverThreshold) {
    foreverDateThreshold = new Date(props?.foreverThreshold);
  }

  // Inject dependencies
  const { isSame, isBefore, substractDate } = useDayjs();
  const { defaultT } = await useI18next("MkDatePresetMenu");
  const { presets, formatPreset, formatDateRange } = await useDatePresets({
    dayPresets: props.days,
    monthPresets: props.months,
    foreverLabel: props.foreverLabel,
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
    let startDate, endDate, title;

    if (Array.isArray(value)) {
      // Deconstruct the array
      const [date1, date2] = value;
      let start, end;

      // determine the start and end date, based on the values, since the order can be the other way around
      if (isBefore.value(new Date(date1), new Date(date2))) {
        start = date1;
        end = date2;
      } else {
        start = date2;
        end = date1;
      }

      // Convert to dayjs,
      // Force the start date at the start of the DAY
      // And the endDate at the end of the DAY
      startDate = dayjs(start).startOf("day").toDate();
      endDate = dayjs(end).endOf("day").toDate();
      title = formatDateRange(startDate, endDate);
    } else {
      // Deconstruct the DateRange
      const { start, end } = value;
      startDate = start;
      endDate = end;
      title = formatPreset(startDate, endDate);
    }

    // Set the value
    state.model.value = [startDate, endDate];

    // Set the title
    state.model.title = title;

    // Apply the changes
    apply();
  }

  function apply() {
    modelValue.value = { ...state.model };
  }

  function openDatePicker() {
    // reset the model value if the custom item is selected and we've just selected forever
    if (isSelectedForeverItem()) updateModelValue(initialModel.value);
    state.datePicker = true;
  }

  function closeDatePicker() {
    state.datePicker = false;
  }

  function setForever() {
    // Set the forever date past the threshold date
    const foreverDate = substractDate.value(foreverDateThreshold, 2, "day");
    updateModelValue([foreverDate, new Date()]);
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
      !presets.value.months.some((x: DateRange) => isSelectedPresetItem(x)) &&
      !isBefore.value(state.model.value[0], foreverDateThreshold)
    );
  }
  /**
   * Check if the forever item is selected. This is the case when the model has a value, but it is not in the presets
   */
  function isSelectedForeverItem() {
    return (
      state.model.value &&
      state.model.value[0] &&
      state.model.value[1] &&
      !presets.value.days?.some((x: DateRange) => isSelectedPresetItem(x)) &&
      !presets.value.months.some((x: DateRange) => isSelectedPresetItem(x)) &&
      isBefore.value(state.model.value[0], foreverDateThreshold)
    );
  }
</script>

<template>
  <v-list v-if="!state.datePicker">
    <v-list-item v-for="(item, i) in presets.days" :key="i" :active="isSelectedPresetItem(item)" @click="updateModelValue(item)">
      <v-list-item-title>{{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-list-item v-if="hasForever" :active="isSelectedForeverItem()" @click="setForever">
      <v-list-item-title> {{ foreverLabel ?? defaultT("Forever") }}</v-list-item-title>
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
