import { computed, ref } from "vue";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isToday from "dayjs/plugin/isToday";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isToday);

export function useDayjs() {
  /** Current date in UTC */
  const currentDayjs = computed<dayjs.Dayjs>(() => dayjs.utc());

  function isFullMonthInternal(date1: Dayjs, date2: Dayjs) {
    // Get start and endpoints of the month
    const startOfMonth = date1.startOf("month");
    const endOfMonth = date2.endOf("month");

    return date1.isSame(date2, "month") && date1.isSame(startOfMonth, "day") && date2.isSame(endOfMonth, "day");
  }

  function isTodayInternal(date1: Dayjs) {
    // compare
    return date1.isToday();
  }

  // Create computed to expose the internal functions
  const isFullMonth = computed(() => isFullMonthInternal);
  const isToday = computed(() => isTodayInternal);

  return {
    currentDayjs,
    isFullMonth,
    isToday,
  };
}
