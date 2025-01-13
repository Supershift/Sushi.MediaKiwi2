import { DateRange } from "./DateRange";

export type TitledDateRange = DateRange & {
  /** the title for the current range */
  title: string;
};
