<script setup lang="ts">
  import { useDatePresets } from "@/composables/useDatePresets";
  import { useI18next } from "@/composables/useI18next";
  import { DateRange } from "@/models/ranges";
  import { reactive } from "vue";
  import { MkDatePicker } from "../MkDatePicker";

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
    }>(),
    {
      days: () => [7, 28, 90, 365],
      months: () => [0, 1, 2],
    }
  );

  const { presets } = useDatePresets({
    dayPresets: props.days,
    monthPresets: props.months,
  });
  const { formatMonth, defaultT, formatDate } = await useI18next();
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
    state.model.title = formatMonth.value(item.start);
    apply();
  }

  function updateModelValueFromDateRange(item: DateRange) {
    state.model.value = [item.start, item.end];
    state.model.title = defaultT.value("LastXDays", defaultLastXDays, { duration: item.duration });
    apply();
  }

  function updateModelValueFromDateArray(item: any[]) {
    state.model.value = [...item];

    // Format the dates to a readable format
    const result = state.model.value?.map((date) => {
      return formatDate.value(date);
    });

    // Join the dates with a dash
    state.model.title = result.join(" - ");

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
</script>

<template>
  <v-list v-if="!state.datePicker">
    <v-list-item v-for="(item, i) in presets.days" :key="i" @click="updateModelValueFromDateRange(item)">
      <v-list-item-title>{{ defaultT("LastXDays", defaultLastXDays, { duration: item.duration }) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item v-for="(item, i) in presets.months" :key="i" @click="updateModelValueFromMonth(item)">
      <v-list-item-title>{{ formatMonth(item.start) }}</v-list-item-title>
    </v-list-item>
    <v-divider />
    <v-list-item @click="openDatePicker">
      <v-list-item-title> {{ defaultT("Custom") }}</v-list-item-title>
    </v-list-item>
  </v-list>
  <MkDatePicker
    v-else-if="state.datePicker"
    v-model="state.model.value"
    multiple
    @click:close="closeDatePicker"
    @update:model-value="updateModelValueFromDateArray"
  />
</template>
