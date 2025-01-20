import { computed, ref } from "vue";
import { useI18next } from "./useI18next";

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

export async function useTimeZones() {
  const { t } = await useI18next("TimeZones");
  // init current time zone
  const storageKey = "timeZone";
  const timeZoneFromStorage = localStorage.getItem(storageKey);
  const currentTimeZone = ref<string>(timeZoneFromStorage || Intl.DateTimeFormat().resolvedOptions().timeZone);

  function timeZoneToName(timeZoneValue: string): string {
    return timeZoneValue.replace("_", " ");
  }

  function setTimeZone(data: string) {
    currentTimeZone.value = data;
    localStorage.setItem(storageKey, data);
  }

  const getTimeZones = computed<TimeZone[]>(() => {
    const result = [
      { name: t.value("Local", "Local").toString(), value: Intl.DateTimeFormat().resolvedOptions().timeZone },
      { name: t.value("UTC", "UTC").toString(), value: "UTC" },
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
