import { computed } from "vue";
import { DateRange } from "@/models/ranges";
import { useDayjs } from "./useDayjs";
import { useI18next } from "./useI18next";

export async function useDatePresets(options?: {
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
}) {
  // refs
  const { currentDate, substractDate, startOf, endOf, getDifference, isFullMonth, isToday } = useDayjs();
  const { dayPresets, monthPresets } = options || {};

  const { formatMonth, defaultT, formatDate } = await useI18next();

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

    if (type === "day" && dayPresets) {
      // Last x days
      for (const day of dayPresets) {
        const current = substractDate.value(start, day, "day");
        result.push({
          start: startOf.value(current, "day"),
          end: endOf.value(end, "day"),
          duration: day,
        });
      }
    } else if (type === "month" && monthPresets) {
      // Add current and last 2 months
      for (const month of monthPresets) {
        const current = substractDate.value(start, month, "month");
        const m = startOf.value(current, "month");

        result.push({
          start: m,
          end: endOf.value(m, "month"),
        });
      }
    }

    // Sort by start date descending
    result.sort((a, b) => b.start.getTime() - a.start.getTime());

    return result;
  }

  function formatPreset(dates: Date[]): string;
  function formatPreset(start: Date, end: Date): string;
  function formatPreset(dates: Date[] | Date, end?: Date): string {
    // determine mode
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      return formatPreset(start, end);
    } else {
      if (dates && end) {
        const start = dates;
        if (isFullMonth.value(start, end)) {
          return formatMonth.value(start);
        } else if (isToday.value(end)) {
          const duration = getDifference.value(start, end, "day");
          return defaultT.value("LastXDays", "Last {{duration}} days", { duration });
        } else {
          return formatDateRange(start, end);
        }
      }
    }

    return "";
  }

  function formatDateRange(start: Date, end: Date, title?: string): string {
    // Format the dates to a readable format
    const result = [formatDate.value(start), formatDate.value(end)];
    
    return title ?? result.join(" - ");
  }

  return {
    currentDate,
    presets,
    formatPreset,
    formatDateRange,
  };
}
