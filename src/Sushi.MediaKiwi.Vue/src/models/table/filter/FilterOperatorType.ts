/** Matches values based on the specified operator. */
/**
 * @enum {number}
 */
export enum FilterOperatorType {
  /** Matches all values that are lower or equal to the specified value. */
  LessThanOrEqualTo = 0,

  /** Matches all values that are greater or equal to the specified value. */
  GreaterThanOrEqualTo = 1,
}

export const FilterOperatorTypeSymbol = new Map<number, string>([
  [FilterOperatorType.LessThanOrEqualTo, "<="],
  [FilterOperatorType.GreaterThanOrEqualTo, ">="],
]);
