import { computed } from "vue";
import { DateRange } from "@/models/ranges";
import { DateTime, Duration } from "luxon";
import { useI18next } from "./useI18next";
import { useTimeZones } from "./useTimeZones";

export async function useDatePresets(options?: {
  /**
   * Collection representing days
   * For the future (Next x days) use negative numbers
   * For the past (Last x days) use positive numbers
   * @example [-7, -14, 7, 28, 90, 365]
   */
  dayPresets: number[];
  /**
 * Collection representing weeks
 * Zero besed, representing the current week, based on current locale
 * @example [-1, 0, 1, 2] Next week, current week, last week, 2 week ago
 */
  weekPresets?: number[];
  /**
   * Collection representing months
   * Zero based, representing the current month
   * @example [-1, 0, 1, 2] Next month, current month, last month, 2 months ago
   */
  monthPresets: number[];
}) {
  const { formatWeek, formatMonth, defaultT, formatDate, t } = await useI18next();

  const { dayPresets, weekPresets, monthPresets } = options ?? {
    dayPresets: [],
    weekPresets: [],
    monthPresets: []
  };

  useTimeZones(t).setLuxonDefaultZone();

  const today = DateTime.now();
  const yesterday = today.minus({ days: 1 });
  const tomorrow = today.plus({ days: 1 });

  const presets = computed(() => {
    return {
      today: getTodayPreset(),
      daysExcludingToday: [...getLastDaysPresets(), ...getNextDaysPresets()],
      weeks: getWeekPreset(),
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

    for (const dayOffset of dayPresets.filter(d => d > 0)) {
      result.push({
        start: today.minus({ days: dayOffset }).startOf("day"),
        end: yesterday.endOf("day"),
        duration: Duration.fromDurationLike({ days: dayOffset }),
      });
    }

    result.sort((a, b) => b.start.toMillis() - a.start.toMillis());
    return result;
  }

  function getNextDaysPresets(): DateRange[] {
    const result: DateRange[] = [];

    for (const dayOffset of dayPresets.filter(d => d < 0)) {
      result.push({
        start: tomorrow.startOf("day"),
        end: today.minus({ days: dayOffset }).endOf("day"),
        duration: Duration.fromDurationLike({ days: dayOffset }),
      });
    }

    result.sort((a, b) => a.start.toMillis() - b.start.toMillis());
    return result;
  }

  function getWeekPreset() {
    const result: DateRange[] = [];

    for (const offset of weekPresets ?? []) {
      const range = today.minus({ week: offset });

      result.push({
        start: range.startOf("week").startOf("day"),
        end: range.endOf("week").endOf("day"),
        duration: Duration.fromDurationLike({ week: 1 }),
      });
    }

    result.sort((a, b) => b.start.toMillis() - a.start.toMillis());
    return result;
  }

  function getMonthPreset() {
    const result: DateRange[] = [];

    for (const offset of monthPresets) {
      const range = today.minus({ months: offset });

      result.push({
        start: range.startOf("month").startOf("day"),
        end: range.endOf("month").endOf("day"),
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
      } else if (isFullWeek(start, end)) {
        return defaultT.value("WeekX", "Week {{weekNumber}}", { weekNumber: formatWeek.value(start) });
      } else if (yesterday.hasSame(end, "day")) {
        const duration = Math.floor(end.diff(start, "days").plus({ days: 1 }).days);
        return defaultT.value("LastXDays", "Last {{duration}} days", { duration });
      } else if (tomorrow.hasSame(start, "day")) {
        const duration = Math.floor(end.diff(start, "days").plus({ days: 1 }).days);
        return defaultT.value("NextXDays", "Next {{duration}} days", { duration });
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

  function isFullWeek(start: DateTime, end: DateTime) {
    return start.hasSame(start.startOf("week"), "day") && end.hasSame(end.endOf("week"), "day") && start.hasSame(end, "week");
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
