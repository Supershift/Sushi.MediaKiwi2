import { computed } from "vue";
import { DateRange } from "@/models/ranges";
import { DateTime, Duration } from "luxon";
import { useI18next } from "./useI18next";
import { useTimeZones } from "./useTimeZones";

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

  const { formatMonth, defaultT, formatDate } = await useI18next();

  const { dayPresets, monthPresets } = options || {};

  useTimeZones().setLuxonDefaultZone();

  const today = DateTime.now();
  const yesterday = today.minus({ days: 1 });


  const presets = computed(() => {
    return {
      daysExcludingToday: getLastDaysPresets(),
      months: getMonthPreset(),
    };
  });

  function getLastDaysPresets(): DateRange[] {
    const result: DateRange[] = [];

    for (const dayOffset of dayPresets ?? []) {
      result.push({
        start: today.minus({ days: dayOffset }).startOf("day"),
        end: yesterday.endOf("day"),
        duration: Duration.fromDurationLike({ days: dayOffset }),
      });
    }

    result.sort((a, b) => b.start.toMillis() - a.start.toMillis());
    return result;
  }

  function getMonthPreset() {
    const result: DateRange[] = [];

    for (const monthOffset of monthPresets ?? []) {
      const month = today.minus({ months: monthOffset });

      result.push({
        start: month.startOf("month").startOf("day"),
        end: month.endOf("month").endOf("day"),
        duration: Duration.fromDurationLike({ months: 1 }),
      });
    }

    result.sort((a, b) => b.start.toMillis() - a.start.toMillis());
    return result;
  }

  function formatPreset(dates: DateTime[]): string;
  function formatPreset(start: DateTime, end: DateTime): string;
  function formatPreset(dates: DateTime[] | DateTime, end?: DateTime): string {

    // determine mode
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      return formatPreset(start, end);
    } else {
      if (dates && end) {
        const start = dates;
        if (isFullMonth(start, end)) {
          return formatMonth.value(start);
        } else if (yesterday.hasSame(end, "day")) {
          const duration = Math.floor(end.diff(start, "days").plus({ days: 1 }).days);
          return defaultT.value("LastXDays", "Last {{duration}} days", { duration });
        } else {
          return formatDateRange(start, end);
        }
      }
    }

    return "";
  }

  function formatDateRange(start: DateTime, end: DateTime, title?: string): string {
    if (title) {
      return title;
    }

    return [formatDate.value(start), formatDate.value(end)].join(" - ");
  }

  function isFullMonth(start: DateTime, end: DateTime) {
    return start.hasSame(start.startOf("month"), "day")
      && end.hasSame(end.endOf("month"), "day")
      && start.hasSame(end, "month");
  }

  return {
    presets,
    formatPreset,
    formatDateRange,
  };
}
