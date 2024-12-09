import { computed } from "vue";
import { DateRange } from "@/models/ranges/DateRange";
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
  const { currentDayjs, isFullMonth, isToday, getDuration } = useDayjs();
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
    const start = currentDayjs.value;
    const end = currentDayjs.value;
    const result = <DateRange[]>[];

    if (type === "day" && dayPresets) {
      // Last x days
      for (const day of dayPresets) {
        const current = start.subtract(day, "day");

        const startOf = current.startOf("day");
        const endOf = end.endOf("day");

        const st = new Date(Date.UTC(startOf.year(), startOf.month(), startOf.date()));
        const et = new Date(Date.UTC(endOf.year(), endOf.month(), endOf.date()));

        result.push({
          start: st,
          end: et,
          duration: day,
        });
      }
    } else if (type === "month" && monthPresets) {
      // Add current and last 2 months
      for (const month of monthPresets) {
        const current = start.subtract(month, "month");

        const startOf = current.startOf("month");
        const endOf = current.endOf("month");

        const st = new Date(Date.UTC(startOf.year(), startOf.month(), startOf.date()));
        const et = new Date(Date.UTC(endOf.year(), endOf.month(), endOf.date(), 23, 59, 59, 999));

        result.push({
          start: st,
          end: et,
        });
      }
    }

    // Sort by start date descending
    result.sort((a, b) => b.start.valueOf() - a.start.valueOf());

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
          const duration = getDuration.value(start, end, "day");
          return defaultT.value("LastXDays", "Last {{duration}} days", { duration });
        } else {
          // Format the dates to a readable format
          const formattedStartDate = formatDate.value(start, { timeZone: "UTC" });
          const formattedEndDate = formatDate.value(end, { timeZone: "UTC" });

          const result = [formattedStartDate, formattedEndDate];
          // Join the dates with a dash
          return result.join(" - ");
        }
      }
    }
    return "";
  }

  return {
    presets,
    formatPreset,
  };
}
