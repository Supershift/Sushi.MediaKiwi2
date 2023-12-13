import { computed } from "vue";
import { DateRange } from "@/models/ranges/DateRange";
import { useDayjs } from "./useDayjs";

type DatePresetOptions = {
  /**
   * Collection of days representing days in the past
   * @example [7, 28, 90, 365]
   */
  dayPresets: number[];
  /**
   * Collection of months representing months in the past
   * Zero besed, representing the current month
   * @example [0, 1, 2] Current month, last month, 2 months ago
   */
  monthPresets: number[];
};

export function useDatePresets(options: DatePresetOptions) {
  // refs
  const { currentDate, substractDate, startOf, endOf } = useDayjs();
  const { dayPresets, monthPresets } = options;

  /** Preset ranges */
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
      for (const day of dayPresets) {
        const current = substractDate(start, day, "day");
        result.push({
          start: current,
          end,
          duration: day,
        });
      }
    } else if (type === "month") {
      // Add current and last 2 months
      for (const month of monthPresets) {
        const current = substractDate(start, month, "month");
        const m = startOf(current, "month");

        result.push({
          start: m,
          end: endOf(m, "month"),
        });
      }
    }

    // Sort by start date descending
    result.sort((a, b) => b.start.getTime() - a.start.getTime());

    return result;
  }

  return {
    currentDate,
    presets,
  };
}
