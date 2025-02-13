import { DateTime, Duration } from "luxon";

export type DateRange = {
  start: DateTime;
  end: DateTime;
  duration?: Duration;
};
