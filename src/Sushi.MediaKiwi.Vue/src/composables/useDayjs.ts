import { computed, ref } from "vue";
import dayjs from "dayjs";

export function useDayjs() {
  // refs
  const currentDayjs = ref<dayjs.Dayjs>(dayjs());
  const currentDate = computed(() => currentDayjs.value.toDate());

  function addDate(date: string | Date, value: number, unit: dayjs.ManipulateType) {
    // parse to dayjs
    let d = dayjs(date);

    // manipulate
    d = d.add(value, unit);

    // return as date
    return d.toDate();
  }

  function substractDate(date: string | Date, value: number, unit: dayjs.ManipulateType) {
    // parse to dayjs
    let d = dayjs(date);

    // manipulate
    d = d.subtract(value, unit);

    // return as date
    return d.toDate();
  }

  function startOf(date: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    const d = dayjs(date);

    // manipulate
    d.startOf(unit);

    // return as date
    return d.toDate();
  }

  function endOf(date: string | Date, unit: dayjs.OpUnitType) {
    // parse to dayjs
    const d = dayjs(date);

    // manipulate
    d.endOf(unit);

    // return as date
    return d.toDate();
  }

  return {
    currentDate,
    addDate,
    substractDate,
    startOf,
    endOf,
  };
}
