import { computed, ComputedRef } from "vue";
import { useStorage } from "@vueuse/core";
import { DateTime, Settings } from "luxon";
import { TFunction } from "i18next";

export type TimeZone = {
  /**
   * Name of the time zone
   */
  name: string;

  /**
   * Name of the time zone prefixed with the UTC offset
   */
  longName: string;
  /**
   * Value of the time zone
   */
  value: string;
  /**
   * UTC offset in minutes
   */
  offset: number;

  /**
   * Readable name of the UTC offset
   */
  offsetName: string;
};

export function useTimeZones(t: ComputedRef<TFunction<string, undefined>>) {
  // init current time zone
  const currentTimeZone = useStorage("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);
  setLuxonDefaultZone();

  function setLuxonDefaultZone() {
    if (currentTimeZone.value != Settings.defaultZone.name) {
      setTimeZone(currentTimeZone.value);
    }
  }

  function getOffsetName(offset: number): string {
    const hours = Math.floor(Math.abs(offset) / 60)
      .toString()
      .padStart(2, "0");
    const minutes = Math.abs(offset) % 60;
    const sign = offset >= 0 ? "+" : "-";

    return `UTC${sign}${hours}:${minutes.toString().padStart(2, "0")}`;
  }

  function setTimeZone(data: string) {
    currentTimeZone.value = data;
    Settings.defaultZone = data;
  }

  function mapTimeZone(timeZoneValue: string): TimeZone {
    const offset = DateTime.now().setZone(timeZoneValue).offset;
    const offsetName = getOffsetName(offset);
    const name = timeZoneValue.replace(/[-_]/g, " ");
    const longName = offsetName === "UTC" ? name : `(${offsetName}) ${name}`;
    return {
      name,
      longName,
      value: timeZoneValue,
      offset,
      offsetName,
    };
  }

  const timeZones = computed<TimeZone[]>(() => {
    const result: TimeZone[] = [];
    result.push(
      ...Intl.supportedValuesOf("timeZone")
        .filter((tz) => tz.includes("/"))
        .map((tz) => mapTimeZone(tz))
    );
    result.sort((a, b) => a.offset - b.offset || a.name.localeCompare(b.name));

    const local = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const mappedLocal = mapTimeZone(local);

    // add defaults to top
    result.unshift(
      ...[
        {
          name: t.value("Default"),
          longName: `(${mappedLocal.offsetName}) ${t.value("Default")}`,
          value: mappedLocal.value,
          offset: mappedLocal.offset,
          offsetName: mappedLocal.offsetName,
        },
        { name: t.value("UTC"), longName: t.value("UTC"), value: "UTC", offset: 0, offsetName: "" },
      ]
    );

    return result;
  });

  /**
   * Used to force/hack a Date created in browser back to the specified time zone.
   * Do not use this for Dates that have a correct UTC time.
   */
  const forceDateIntoTimeZone = (date: Date): DateTime => {
    return DateTime.local(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getMilliseconds());
  };

  return { timeZones, setTimeZone, currentTimeZone, forceDateIntoTimeZone, setLuxonDefaultZone };
}
