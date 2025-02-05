<script setup lang="ts">
  import { useDatePresets } from "@/composables/useDatePresets";
  import { useDayjs } from "@/composables/useDayjs";
  import { useI18next } from "@/composables/useI18next";
  import { DateRange, TitledDateRange } from "@/models/ranges";
  import { computed, ref } from "vue";
  import { MkDatePicker } from "../MkDatePicker";

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

  const modelValue = defineModel<{ value: Date[]; title?: string }>({ required: true });

  const { isSame, isBefore, startOf, endOf } = useDayjs();
  const { defaultT } = await useI18next("MkDatePresetMenu");
  const { presets, formatPreset, formatDateRange } = await useDatePresets({
    dayPresets: props.days,
    monthPresets: props.months,
  });

  const isDatePickerOpen = ref(false);

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
    modelValue.value = { title, value: range };
  }

  const hasSameStartAndEndDateAsModel = computed(
    () => (item: DateRange) => isSame.value(item.start, modelValue.value.value[0], "day") && isSame.value(item.end, modelValue.value.value[1], "day")
  );

  const isPreset = computed(() => {
    return (
      modelValue.value.value.length == 2 &&
      (presets.value.days.some(hasSameStartAndEndDateAsModel.value) ||
        presets.value.months.some(hasSameStartAndEndDateAsModel.value) ||
        props.customOptions?.some(hasSameStartAndEndDateAsModel.value))
    );
  });
</script>

<template>
  <MkDatePicker
    v-if="isDatePickerOpen"
    :modelValue="modelValue.value"
    :class="datePickerClass"
    :title="datePickerTitle"
    multiple
    @click:close="isDatePickerOpen = false"
    @update:model-value="updateDateArray"
  />
  <v-list v-else>
    <v-list-item v-for="(item, i) in presets.days" :key="i" :active="hasSameStartAndEndDateAsModel(item)" @click="updateDateRange(item)">
      <v-list-item-title>{{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item v-for="(item, i) in presets.months" :key="i" :active="hasSameStartAndEndDateAsModel(item)" @click="updateDateRange(item)">
      <v-list-item-title> {{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider v-if="props.customOptions" />
    <v-list-item v-for="(item, i) in props.customOptions" :key="i" :active="hasSameStartAndEndDateAsModel(item)" @click="updateTitledDateRange(item)">
      <v-list-item-title> {{ formatDateRange(item.start, item.end, item.title) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item :active="!isPreset" @click="isDatePickerOpen = true">
      <v-list-item-title> {{ defaultT("Custom") }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
