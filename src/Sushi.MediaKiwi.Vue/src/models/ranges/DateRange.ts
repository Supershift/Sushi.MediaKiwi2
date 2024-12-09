import { Dayjs } from "dayjs";

export type DateRange = {
  /** start date of the current range */
  start: Dayjs;
  /** end date of the current range */
  end: Dayjs;
  /** Duration in days */
  duration?: number;
};
