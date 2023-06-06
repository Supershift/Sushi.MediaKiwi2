import { MoneyValue } from "@/models";
import { i18n } from "i18next";
import { Ref, computed, inject, ref } from "vue";

/**
 * Adds i18next to the component.
 * @param namespace If provided, the t function will be scoped to this namespace.
 * @returns
 */
export async function useI18next(namespace?: string) {
  // inject dependencies
  const i18next = inject<Ref<i18n>>("i18next");

  if (!i18next) {
    throw new Error("i18next is not provided, install the plugin first");
  }

  const i18nInitPromise = inject<Promise<any>>("i18initPromise");

  // check if i18next is initialized
  await i18nInitPromise;

  // if a namespace is provided, check if it already exists on i18next and if not, add it
  if (namespace && !i18next.value.hasLoadedNamespace(namespace)) {
    //await i18next.value.loadNamespaces(namespace);
    await i18next.value.loadNamespaces(namespace);
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

  // format datetime
  const formatDateTimeInternal = (date: string | Date): string => {
    return formatDateTimeGeneric(date, { dateStyle: "short", timeStyle: "short" });
  };

  const formatDateInternal = (date: string | Date): string => {
    return formatDateTimeGeneric(date, { dateStyle: "short" });
  };

  const formatTimeInternal = (date: string | Date): string => {
    return formatDateTimeGeneric(date, { timeStyle: "short" });
  };

  const formatDateTimeGeneric = (date: string | Date, options: Intl.DateTimeFormatOptions): string => {
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

  const formatDateTime = computed(() => formatDateTimeInternal);
  const formatDate = computed(() => formatDateInternal);
  const formatTime = computed(() => formatTimeInternal);

  // number formatting
  const formatNumberInternal = (value: number): string => {
    return Intl.NumberFormat(i18next.value.resolvedLanguage).format(value);
  };

  const formatNumber = computed(() => formatNumberInternal);

  // currency formatting
  const formatMoneyValueInternal = (value?: MoneyValue): string => {
    if (value) return Intl.NumberFormat(i18next.value.resolvedLanguage, { style: "currency", currency: value.currency }).format(value.amount);
    else return "";
  };
  const formatMoneyValue = computed(() => formatMoneyValueInternal);

  return {
    i18next,
    /** T function scoped to the namespace provided when adding composable. If non provided, scoped to default. */
    t,
    /** T function scoped to the default namespace */
    defaultT,
    /** Formats a Date object or iso8601 string to a localized string with date and time */
    formatDateTime,
    /** Formats a Date object or iso8601 string to a localized date string, e.g. 22-05-2021, 05/22/2023 */
    formatDate,
    /** Formats a Date object or iso8601 string to a localized time string, e.g. 22:24, 10:24PM */
    formatTime,
    formatNumber,
    formatMoneyValue,
  };
}
