import { computed, ref } from "vue";
import { DateRange } from "@/models/ranges/DateRange";
import dayjs from "dayjs";

export function useDateRange() {
  // refs
  const currentDayjs = ref<dayjs.Dayjs>(dayjs());
  const currentDate = computed(() => currentDayjs.value.toDate());

  /**
   * Preset ranges
   */
  const presets = computed(() => {
    return {
      days: getPreset("day"),
      months: getPreset("month"),
    };
  });

  /**
   * Returns a list of preset ranges
   * @returns
   */
  function getPreset(type: "day"): DateRange[];
  function getPreset(type: "month"): DateRange[];
  function getPreset(type: "day" | "month") {
    const start = currentDayjs.value.clone();
    const end = currentDayjs.value.clone().toDate();
    const result = <DateRange[]>[];

    if (type === "day") {
      // Last x days
      for (const day of [7, 28, 90, 365]) {
        const d = start.add(day * -1, "day").startOf("day");
        result.push({
          start: d.toDate(),
          end,
          duration: day,
        });
      }
    } else if (type === "month") {
      // Add current and last 2 months
      for (const month of [0, 1, 2]) {
        const m = start.add(month * -1, "month").startOf("month");

        result.push({
          start: m.toDate(),
          end: m.endOf("month").toDate(),
        });
      }
    }

    return result;
  }

  return {
    currentDate,
    presets,
  };
}
