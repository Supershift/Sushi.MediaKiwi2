import { computed, ref } from "vue";
import dayjs from "dayjs";

export function useDayjs() {
  // refs
  const currentDayjs = ref<dayjs.Dayjs>(dayjs());
  const currentDate = computed(() => currentDayjs.value.toDate());

  function addDateInternal(date: string | Date, value: number, unit: dayjs.ManipulateType) {
    // parse to dayjs
    let d = dayjs(date);

    // manipulate
    d = d.add(value, unit);

    // return as date
    return d.toDate();
  }

  function substractDateInternal(date: string | Date, value: number, unit: dayjs.ManipulateType) {
    // parse to dayjs
    let d = dayjs(date);

    // manipulate
    d = d.subtract(value, unit);

    // return as date
    return d.toDate();
  }

  function startOfInternal(date: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    let d = dayjs(date);

    // manipulate
    d = d.startOf(unit);

    // return as date
    return d.toDate();
  }

  function endOfInternal(date: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    let d = dayjs(date);

    // manipulate
    d = d.endOf(unit);

    // return as date
    return d.toDate();
  }

  function isSameInternal(date1: string | Date, date2: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);

    // compare
    return d1.isSame(d2, unit);
  }

  function isBeforeInternal(date1: string | Date, date2: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);

    // compare
    return d1.isBefore(d2, unit);
  }

  function isAfterInternal(date1: string | Date, date2: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);

    // compare
    return d1.isAfter(d2, unit);
  }

  function getDifferenceInternal(date1: string | Date, date2: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    const d1 = dayjs(date1);
    const d2 = dayjs(date2);

    // compare
    return d2.diff(d1, unit);
  }

  function isFullMonthInternal(date1: string | Date, date2: string | Date) {
    // parse to dayjs
    let d1 = dayjs(date1);
    let d2 = dayjs(date2);

    return d1.isSame(d1.startOf("month")) && d2.isSame(d2.endOf("month"));
  }

  function isTodayInternal(date1: string | Date) {
    // parse to dayjs
    const d1 = dayjs(date1).startOf("day");
    const today = dayjs().startOf("day");

    // compare
    return d1.isSame(today);
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
    currentDate,
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
  };
}
