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

  // Create computed to expose the internal functions
  const addDate = computed(() => addDateInternal);
  const substractDate = computed(() => substractDateInternal);
  const startOf = computed(() => startOfInternal);
  const endOf = computed(() => endOfInternal);
  const isSame = computed(() => isSameInternal);
  const isBefore = computed(() => isBeforeInternal);
  const isAfter = computed(() => isAfterInternal);

  return {
    currentDate,
    addDate,
    substractDate,
    startOf,
    endOf,
    isSame,
    isBefore,
    isAfter,
  };
}
