import { i18n } from "i18next";
import { Ref, computed, inject } from "vue";

/**
 * Adds i18next to the component.
 * @param namespace If provided, the t function will be scoped to this namespace.
 * @returns
 */
export function useI18next(namespace?: string) {
  // get global i18next from app
  const i18next = inject<Ref<i18n>>("i18next");

  if (!i18next) {
    throw new Error("i18next is not provided, install the plugin first");
  }

  // provide reactive t functions for provided namespace
  const t = computed(() => {
    if (namespace) {
      return i18next.value.getFixedT(null, namespace);
    } else {
      return i18next.value.t;
    }
  });

  const defaultT = computed(() => i18next.value.t);

  // provide reactive date time formatters for current language
  const parseDateTime = (date: string | Date): string => {
    return formatDate(date, { dateStyle: "short", timeStyle: "short" });
  };

  const parseDate = (date: string | Date): string => {
    return formatDate(date, { dateStyle: "short" });
  };

  const parseTime = (date: string | Date): string => {
    return formatDate(date, { timeStyle: "short" });
  };

  const formatDate = (date: string | Date, options: Intl.DateTimeFormatOptions): string => {
    // parse or cast to date, depending on parameter type
    let dateValue: Date;
    if (typeof date === "string") {
      dateValue = new Date(date);
    } else {
      dateValue = date as Date;
    }
    const result = Intl.DateTimeFormat(i18next.value.resolvedLanguage, options).format(dateValue);
    return result;
  };

  const dateTime = computed(() => parseDateTime);
  const date = computed(() => parseDate);
  const time = computed(() => parseTime);

  return {
    i18next,
    /** T function scoped to the namespace provided when adding composable. If non provided, scoped to default. */
    t,
    /** T function scoped to the default namespace */
    defaultT,
    /** Formats a Date object or iso8601 string to a localized string with date and time */
    dateTime,
    /** Formats a Date object or iso8601 string to a localized date string, e.g. 22-05-2021, 05/22/2023 */
    date,
    /** Formats a Date object or iso8601 string to a localized time string, e.g. 22:24, 10:24PM */
    time,
  };
}
