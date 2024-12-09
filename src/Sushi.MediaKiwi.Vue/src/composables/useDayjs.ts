import { computed } from "vue";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);

export function useDayjs() {
  /** Current date in UTC */
  const currentDayjs = computed<dayjs.Dayjs>(() => dayjs.utc());

  function isFullMonthInternal(date1: Date, date2: Date) {
    const d1 = dayjs.utc(date1);
    const d2 = dayjs.utc(date2);

    // Get start and endpoints of the month
    const startOfMonth = d1.startOf("month");
    const endOfMonth = d2.endOf("month");

    return d1.isSame(d2, "month") && d1.isSame(startOfMonth, "day") && d2.isSame(endOfMonth, "day");
  }

  function isTodayInternal(date1: Date) {
    const d1 = dayjs(date1);

    // compare
    return d1.isToday();
  }

  function getDurationInternal(date1: Date, date2: Date, unit: dayjs.ManipulateType) {
    const d1 = dayjs.utc(date1);
    const d2 = dayjs.utc(date2);

    return d2.diff(d1, unit);
  }

  // Create computed to expose the internal functions
  const isFullMonth = computed(() => isFullMonthInternal);
  const isToday = computed(() => isTodayInternal);
  const getDuration = computed(() => getDurationInternal);

  return {
    currentDayjs,
    isFullMonth,
    isToday,
    getDuration,
  };
}
