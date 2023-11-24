import { computed } from "vue";
import { DateRange } from "@/models/ranges/DateRange";
import { useDayjs } from "./useDayjs";

type DatePresetOptions = {
  dayOptions: number[];
  monthOptions: number[];
};

export function useDatePresets(options?: DatePresetOptions) {
  // refs
  const { currentDate, substractDate, startOf, endOf } = useDayjs();
  const { dayOptions, monthOptions } = options || { dayOptions: [7, 28, 90, 365], monthOptions: [0, 1, 2] };

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
    const start = currentDate.value;
    const end = currentDate.value;
    const result = <DateRange[]>[];

    if (type === "day") {
      // Last x days
      for (const day of dayOptions) {
        const current = substractDate(start, day, "day");
        result.push({
          start: current,
          end,
          duration: day,
        });
      }

      // Sort by start date descending
      result.sort((a, b) => b.start.getTime() - a.start.getTime());
    } else if (type === "month") {
      // Add current and last 2 months
      for (const month of monthOptions) {
        const current = substractDate(start, month, "month");
        const m = startOf(current, "month");

        result.push({
          start: m,
          end: endOf(m, "month"),
        });
      }

      // Sort by date ascending
      result.sort((a, b) => a.start.getTime() - b.start.getTime());
    }

    return result;
  }

  return {
    currentDate,
    presets,
  };
}
