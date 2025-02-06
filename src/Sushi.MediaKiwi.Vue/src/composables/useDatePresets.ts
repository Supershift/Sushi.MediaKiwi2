import { computed } from "vue";
import { DateRange } from "@/models/ranges";
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
  const { currentDayjs, getDifference, isFullMonth } = useDayjs();
  const { dayPresets, monthPresets } = options || {};

  const today = computed(() => currentDayjs.value);
  const yesterday = computed(() => today.value.subtract(1, "day"));

  const { formatMonth, defaultT, formatDate } = await useI18next();

  const presets = computed(() => {
    return {
      daysExcludingToday: getLastDaysPresets(today.value, yesterday.value),
      months: getMonthPreset(today.value),
    };
  });

  function getLastDaysPresets(today: Dayjs, yesterday: Dayjs): DateRange[] {
    const result: DateRange[] = [];

    for (const dayOffset of dayPresets ?? []) {
      result.push({
        start: today.subtract(dayOffset, "day").startOf("day").toDate(),
        end: yesterday.endOf("day").toDate(),
        duration: dayOffset,
      });
    }

    result.sort((a, b) => b.start.getTime() - a.start.getTime());
    return result;
  }

  function getMonthPreset(today: Dayjs) {
    const result: DateRange[] = [];

    for (const monthOffset of monthPresets ?? []) {
      const month = today.subtract(monthOffset, "month");

      result.push({
        start: month.startOf("month").toDate(),
        end: month.endOf("month").toDate(),
      });
    }

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
        } else if (yesterday.value.isSame(end, "day")) {
          const duration = getDifference.value(start, end, "day") + 1;
          return defaultT.value("LastXDays", "Last {{duration}} days", { duration });
        } else {
          return formatDateRange(start, end);
        }
      }
    }

    return "";
  }

  function formatDateRange(start: Date, end: Date, title?: string): string {
    if (title) {
      return title;
    }

    // Format the dates to a readable format
    const result = [formatDate.value(start), formatDate.value(end)];
    return result.join(" - ");
  }

  return {
    presets,
    formatPreset,
    formatDateRange,
  };
}
