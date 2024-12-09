import { computed } from "vue";
import { DateRange } from "@/models/ranges/DateRange";
import { useDayjs } from "./useDayjs";
import { useI18next } from "./useI18next";
import { Dayjs } from "dayjs";

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
  const { currentDayjs, isFullMonth, isToday } = useDayjs();
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

        result.push({
          start: startOf,
          end: endOf,
          duration: day,
        });
      }
    } else if (type === "month" && monthPresets) {
      // Add current and last 2 months
      for (const month of monthPresets) {
        const current = start.subtract(month, "month");

        const startOf = current.startOf("month");
        const endOf = current.endOf("month");

        result.push({
          start: startOf,
          end: endOf,
        });
      }
    }

    // Sort by start date descending
    result.sort((a, b) => b.start.valueOf() - a.start.valueOf());

    return result;
  }

  function isDate(object: any): object is Date {
    return object instanceof Date;
  }

  function formatPreset(dates: Dayjs[]): string;
  function formatPreset(start: Dayjs, end: Dayjs): string;
  function formatPreset(start: Date, end: Date): string;
  function formatPreset(dates: Dayjs[] | Dayjs | Date, end?: Dayjs | Date): string {
    // determine mode
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      return formatPreset(start, end);
    } else {
      if (dates && end) {
        const start = dates;

        if (!isDate(start) && !isDate(end) && isFullMonth.value(start, end)) {
          return formatMonth.value(start.toDate());
        } else if (!isDate(end) && isToday.value(end)) {
          const duration = end.diff(start, "day");
          return defaultT.value("LastXDays", "Last {{duration}} days", { duration });
        } else {
          let startDate = isDate(start) ? start : start.toDate();
          let endDate = isDate(end) ? end : end.toDate();

          // Format the dates to a readable format
          const formattedStartDate = formatDate.value(startDate, { timeZone: "UTC" });
          const formattedEndDate = formatDate.value(endDate, { timeZone: "UTC" });

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
