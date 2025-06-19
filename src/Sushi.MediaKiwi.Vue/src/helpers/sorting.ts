import { SortDirection } from "@/models";
import { DateTime } from "luxon";

/** Compare two values. Returns 1 is 'a' is greater than 'b', 0 if equal and -1 if 'a' is less than 'b'. */
export function compareValues<TValue>(a: TValue, b: TValue) {
  // handle any null/undefined cases
  const isNullish = (v: unknown) => v === null || v === undefined;
  if (isNullish(a) && isNullish(b)) return 0;
  if (isNullish(a)) return 1;
  if (isNullish(b)) return -1;

  // Handle Luxon DateTime
  if (DateTime.isDateTime(a) && DateTime.isDateTime(b)) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  // Handle strings (case-insensitive)
  if (typeof a === "string" && typeof b === "string") {
    const result = a.localeCompare(b, undefined, { sensitivity: "base" });
    return result;
  }

  // handle numbers and other simple to compare types
  if (a > b) return 1;
  if (a < b) return -1;

  return 0;
}

/**  Sort an array of objects in place. This method mutates the original array */
export function sortArray<TObject, TValue>(array: TObject[], sortBy: (item: TObject) => TValue, direction: SortDirection = SortDirection.Asc): TObject[] {  
  return array.sort((a, b) => {
    // get the values to compare
    const aValue = sortBy(a);
    const bValue = sortBy(b);

    let compareResult = compareValues(aValue, bValue);
    // negate result if direction is descending
    if (direction == SortDirection.Desc) {
      compareResult *= -1;
    }
    return compareResult;
  });
}

/** Sort an array of objects in place. This method mutates the original array */
export function sortArrayByKey<T, K extends keyof T>(array: T[], sortBy: K, direction: SortDirection = SortDirection.Asc): T[] {
  return sortArray(array, (item) => item[sortBy], direction);
}
