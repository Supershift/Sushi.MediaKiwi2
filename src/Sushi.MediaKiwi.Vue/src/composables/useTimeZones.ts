import { computed, ref } from "vue";

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
    return timeZoneValue.replace("_", " ");
  }

  function setTimeZone(data: string) {
    currentTimeZone.value = data;
    localStorage.setItem(storageKey, data);
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

  return { getTimeZones, setTimeZone, currentTimeZone };
}
