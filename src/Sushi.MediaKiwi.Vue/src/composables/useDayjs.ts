import { computed, ref, watch } from "vue";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // load on demand
import utc from "dayjs/plugin/utc"; // load on demand
dayjs.extend(timezone);
dayjs.extend(utc);

import { useTimeZones } from "./useTimeZones";
const { currentTimeZone } = useTimeZones();

export function useDayjs() {
  dayjs.tz.setDefault(currentTimeZone.value);

  // refs
  const currentDayjs = ref<dayjs.Dayjs>(dayjs.tz());

  function addDateInternal(date: string | Date, value: number, unit: dayjs.ManipulateType) {
    // parse to dayjs
    let d = dayjs(date).tz();

    // manipulate
    d = d.add(value, unit);

    // return as date
    return d.toDate();
  }

  function substractDateInternal(date: string | Date, value: number, unit: dayjs.ManipulateType) {
    // parse to dayjs
    let d = dayjs(date).tz();

    // manipulate
    d = d.subtract(value, unit);

    // return as date
    return d.toDate();
  }

  function startOfInternal(date: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    let d = dayjs(date).tz();

    // manipulate
    d = d.startOf(unit);

    // return as date
    return d.toDate();
  }

  function endOfInternal(date: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    let d = dayjs(date).tz();

    // manipulate
    d = d.endOf(unit);

    // return as date
    return d.toDate();
  }

  function isSameInternal(date1: string | Date, date2: string | Date, unit?: dayjs.OpUnitType) {
    // parse to dayjs
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);

    // compare
    return d1.isSame(d2, unit);
  }

  function isBeforeInternal(date1: string | Date, date2: string | Date, unit?: dayjs.OpUnitType) {
    // parse to dayjs
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);

    // compare
    return d1.isBefore(d2, unit);
  }

  function isAfterInternal(date1: string | Date, date2: string | Date, unit?: dayjs.OpUnitType) {
    // parse to dayjs
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);

    // compare
    return d1.isAfter(d2, unit);
  }

  function getDifferenceInternal(date1: string | Date, date2: string | Date, unit?: dayjs.OpUnitType) {
    // parse to dayjs
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);

    // compare
    return d2.diff(d1, unit);
  }

  function isFullMonthInternal(date1: string | Date, date2: string | Date) {
    // parse to dayjs
    let d1 = dayjs(date1).tz();
    let d2 = dayjs(date2).tz();
    return d1.isSame(d1.startOf("month")) && d2.isSame(d2.endOf("month"));
  }

  function isTodayInternal(date1: string | Date) {
    // parse to dayjs
    const d1 = dayjs(date1).tz().startOf("day");
    const today = currentDayjs.value.startOf("day");

    // compare
    return d1.isSame(today);
  }

  function inConfiguredTimeZone(input: Date) {
    const formatted = `${input.getFullYear()}-${input.getMonth() + 1}-${input.getDate()} ${input.getHours()}:${input.getMinutes()}:${input.getSeconds()}:${input.getMilliseconds()}`;
    const result = dayjs.tz(formatted, "YYYY-M-D H:s:S", currentTimeZone.value);
    return result.toDate();
  }

  // Create computed to expose the internal functions
  const addDate = computed(() => addDateInternal);
  const substractDate = computed(() => substractDateInternal);
  const startOf = computed(() => startOfInternal);
  const endOf = computed(() => endOfInternal);
  const isSame = computed(() => isSameInternal);
  const isBefore = computed(() => isBeforeInternal);
  const isAfter = computed(() => isAfterInternal);
  const getDifference = computed(() => getDifferenceInternal);
  const isFullMonth = computed(() => isFullMonthInternal);
  const isToday = computed(() => isTodayInternal);

  return {
    currentDayjs,
    addDate,
    substractDate,
    startOf,
    endOf,
    isSame,
    isBefore,
    isAfter,
    getDifference,
    isFullMonth,
    isToday,
    inConfiguredTimeZone,
  };
}
