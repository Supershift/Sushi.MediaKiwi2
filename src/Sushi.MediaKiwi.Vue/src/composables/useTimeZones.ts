import { computed, ref } from "vue";
import { useStorage } from "@vueuse/core";
import { DateTime, Settings } from "luxon";

export type TimeZone = {
  /**
   * Name of the time zone
   */
  name: string;
  /**
   * Value of the time zone
   */
  value: string;
};

export function useTimeZones() {
  // init current time zone
  const currentTimeZone = useStorage("timeZone", Intl.DateTimeFormat().resolvedOptions().timeZone);

  function timeZoneToName(timeZoneValue: string): string {
    return timeZoneValue.replace(/[-_]/g, " ");
  }

  function setTimeZone(data: string) {
    currentTimeZone.value = data;
    Settings.defaultZone = data;
  }

  const timeZones = computed<TimeZone[]>(() => {
    const result = [
      { name: "Local", value: Intl.DateTimeFormat().resolvedOptions().timeZone },
      { name: "UTC", value: "UTC" },
    ];
    result.push(
      ...Intl.supportedValuesOf("timeZone")
        .filter((tz) => tz.includes("/"))
        .map((tz) => {
          return {
            name: timeZoneToName(tz),
            value: tz,
          };
        })
    );
    return result;
  });

  /**
   * Used to force/hack a Date created in browser back to the specified time zone. 
   * Do not use this for Dates that have a correct UTC time.
   */
  const forceDateIntoTimeZone = (date: Date): DateTime => {
    return DateTime.local(date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getMilliseconds());
  }

  return { timeZones, setTimeZone, currentTimeZone, forceDateIntoTimeZone };
}
