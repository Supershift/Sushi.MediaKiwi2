<script setup lang="ts">
  import { useDatePresets } from "@/composables/useDatePresets";
  import { useI18next } from "@/composables/useI18next";
  import { DateRange, TitledDateRange } from "@/models/ranges";
  import { computed, ref } from "vue";
  import { MkDatePicker } from "../MkDatePicker";
  import { DateTime } from "luxon";

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
       * @example [{ title: "Last 11 days", start: DateTime.now().minus({ days: 12 }), end: DateTime.now().minus({ days: 1 }) }]
       */
      customOptions?: Array<TitledDateRange>;
    }>(),
    {
      days: () => [7, 28, 90, 365],
      months: () => [0, 1, 2],
    }
  );

  const modelValue = defineModel<{ value: DateTime[]; title?: string }>({
    default: {
      title: "Last 2 days",
      value: [
        DateTime.now().startOf("day").plus({ minutes: DateTime.now().offset }).minus({ days: 2 }),
        DateTime.now().startOf("day").plus({ minutes: DateTime.now().offset }),
      ],
    },
  });

  const emit = defineEmits<(e: "click:close") => void>();

  const { defaultT } = await useI18next("MkDatePresetMenu");
  const { presets, formatPreset, formatDateRange } = await useDatePresets({
    dayPresets: props.days,
    monthPresets: props.months,
  });

  const isDatePickerOpen = ref(false);

  const close = () => {
    isDatePickerOpen.value = false;
    emit("click:close");
  };

  function updateFromPicker(value: DateTime[]): void {
    let [date1, date2] = value;

    if (date2 < date1) {
      [date1, date2] = [date2, date1];
    }

    const title = formatDateRange(date1, date2);
    apply([date1, date2], title);
  }

  function updateFromPreset(value: DateRange): void {
    const title = formatPreset(value.start, value.end);
    apply([value.start, value.end], title);
  }

  function updateFromTitledPreset(value: TitledDateRange): void {
    const title = formatDateRange(value.start, value.end, value.title);
    apply([value.start, value.end], title);
  }

  function apply(range: DateTime[], title: string) {
    modelValue.value = { title, value: range };
  }

  const hasSameStartAndEndDateAsModel = computed(() => (item: DateRange) => {
    if (!item.start) return false;
    return item.start.hasSame(modelValue.value.value[0], "day") && item.end.hasSame(modelValue.value.value[1], "day");
  });

  const isPreset = computed(() => {
    return (
      modelValue.value?.value?.length == 2 &&
      (presets.value.daysExcludingToday.some(hasSameStartAndEndDateAsModel.value) ||
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
    @click:close="close"
    @update:model-value="updateFromPicker"
  />
  <v-list v-else>
    <v-list-item v-for="(item, i) in presets.daysExcludingToday" :key="i" :active="hasSameStartAndEndDateAsModel(item)" @click="updateFromPreset(item)">
      <v-list-item-title>{{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item v-for="(item, i) in presets.months" :key="i" :active="hasSameStartAndEndDateAsModel(item)" @click="updateFromPreset(item)">
      <v-list-item-title> {{ formatPreset(item.start, item.end) }}</v-list-item-title>
    </v-list-item>
    <v-divider v-if="props.customOptions" />
    <v-list-item v-for="(item, i) in props.customOptions" :key="i" :active="hasSameStartAndEndDateAsModel(item)" @click="updateFromTitledPreset(item)">
      <v-list-item-title> {{ formatDateRange(item.start, item.end, item.title) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item :active="!isPreset" @click="isDatePickerOpen = true">
      <v-list-item-title> {{ defaultT("Custom") }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
