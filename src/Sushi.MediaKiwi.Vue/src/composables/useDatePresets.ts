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
  const { formatMonth, defaultT, formatDate, t } = await useI18next();

  const { dayPresets, monthPresets } = options || {};

  useTimeZones(t).setLuxonDefaultZone();

  const today = DateTime.now();
  const yesterday = today.minus({ days: 1 });

  const presets = computed(() => {
    return {
      today: getTodayPreset(),
      daysExcludingToday: getLastDaysPresets(),
      months: getMonthPreset(),
    };
  });

  function getTodayPreset(): DateRange {
    return {
      start: today.startOf("day"),
      end: today,
      duration: Duration.fromDurationLike({ days: 1 }),
    };
  }

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

  /**
   * Formats the dates into a human readable string.
   * @param dates Array of 2 dates representing the start and end date.
   * @example "Today", "Last 7 days", "Last 30 days", "April", "May"
   */
  function formatPreset(dates: DateTime[]): string;
  /**
   * Formats the start and end dates into a human readable string.
   * @param start Start date
   * @param end End date
   * @example "Today", "Last 7 days", "Last 30 days", "April", "May"
   */
  function formatPreset(start: DateTime, end: DateTime): string;
  function formatPreset(dates: DateTime[] | DateTime, end?: DateTime): string {
    // determine mode
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      return formatPreset(start, end);
    } else if (dates && end) {
      const start = dates;
      if (isFullMonth(start, end)) {
        return formatMonth.value(start);
      } else if (yesterday.hasSame(end, "day")) {
        const duration = Math.floor(end.diff(start, "days").plus({ days: 1 }).days);
        return defaultT.value("LastXDays", "Last {{duration}} days", { duration });
      } else if (isToday(start, end)) {
        return defaultT.value("Today", "Today");
      } else {
        return formatDateRange(start, end);
      }
    }

    return "";
  }

  /**
   * Formats the start and end date into a date string. Using the locale format.
   * When a title is provided, it will be used instead of the date range.
   * @param start Start date
   * @param end End date
   * @example "2023-01-01 - 2023-01-31", "2023-01-01"
   */
  function formatDateRange(start: DateTime, end: DateTime, title?: string): string {
    if (title) {
      return title;
    }

    if (isToday(start, end)) {
      return formatDate.value(start);
    }

    return [formatDate.value(start), formatDate.value(end)].join(" - ");
  }

  function isFullMonth(start: DateTime, end: DateTime) {
    return start.hasSame(start.startOf("month"), "day") && end.hasSame(end.endOf("month"), "day") && start.hasSame(end, "month");
  }

  /**
   * Check if the start and end date are the same day.
   * @param start Start date
   * @param end End date
   * @returns True if the start and end date are the same day, false otherwise.
   */
  function isToday(start: DateTime, end: DateTime) {
    return start.hasSame(today, "day") && end.hasSame(today, "day");
  }

  return {
    presets,
    formatPreset,
    formatDateRange,
  };
}
