import { identity } from "@/identity";
import { MediakiwiVueOptions, MoneyValue, View } from "@/models";
import { tokenStore } from "@/plugins/i18next";
import { i18n } from "i18next";
import { Ref, computed, inject } from "vue";
import { useNavigation } from "@/composables/useNavigation";
import { container } from "tsyringe";

/**
 * Adds i18next to the component.
 * @param scope If provided, the t function will be scoped to this namespace. If left undefined, it will be scoped to the current view.
 * @returns
 */
export async function useI18next(scope?: View | string) {
  // inject dependencies
  const navigation = useNavigation();
  const i18next = container.resolve<Ref<i18n>>("i18next");
  const mediakiwiOptions = container.resolve<MediakiwiVueOptions>("MediakiwiOptions");

  if (!i18next) {
    throw new Error("i18next is not provided, install the plugin first");
  }

  const i18nInitPromise = container.resolve<Promise<any>>("i18initPromise");

  // check if i18next is initialized
  await i18nInitPromise;

  // determine namespace
  if (!scope) {
    scope = navigation.currentNavigationItem.value?.view;
    if (!scope) scope = "common";
  }

  let namespace: string;
  if (typeof scope === "string") {
    namespace = scope;
  } else {
    namespace = (scope as View).id;
  }

  // if a namespace is provided, check if it already exists on i18next and if not, add it
  if (namespace && !i18next.value.hasLoadedNamespace(namespace)) {
    // this involves an api call, which requires authentication
    // as a temporary fix, we acquire the token here
    const accessToken = await identity.getAccessToken();
    tokenStore.token = accessToken;

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
  const dateOptions = computed(() => mediakiwiOptions?.dateFormatOptions?.date || <Intl.DateTimeFormatOptions>{ dateStyle: "short" });
  const timeOptions = computed(() => mediakiwiOptions?.dateFormatOptions?.time || <Intl.DateTimeFormatOptions>{ timeStyle: "short" });
  const monthOptions = computed(() => mediakiwiOptions?.dateFormatOptions?.month || <Intl.DateTimeFormatOptions>{ month: "long" });

  const formatDateTimeInternal = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    // Use the custom provided options, or merge the date and time options
    const formatOptions = options || { ...dateOptions.value, ...timeOptions.value };

    return formatDateTimeGenericInternal(date, { ...formatOptions });
  };

  const formatDateInternal = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    // Use the custom provided options, or merge the date options
    const formatOptions = options || { ...dateOptions.value };

    return formatDateTimeGenericInternal(date, { ...formatOptions });
  };

  const formatTimeInternal = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    // Use the custom provided options, or merge the time options
    const formatOptions = options || { ...timeOptions.value };

    return formatDateTimeGenericInternal(date, { ...formatOptions });
  };

  const formatMonthInternal = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    // Use the custom provided options, or merge the month options
    const formatOptions = options || { ...monthOptions.value };

    return formatDateTimeGenericInternal(date, { ...formatOptions });
  };

  const formatDateTimeGenericInternal = (date: string | Date, options: Intl.DateTimeFormatOptions): string => {
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
  const formatMonth = computed(() => formatMonthInternal);
  const formatDateTimeGeneric = computed(() => formatDateTimeGenericInternal);

  // number formatting
  const formatNumberInternal = (value: number, options?: Intl.NumberFormatOptions): string => {
    return Intl.NumberFormat(i18next.value.resolvedLanguage, options).format(value);
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
    /** T function scoped to the default namespace (which by default is 'common') */
    defaultT,
    /** Formats a Date object or iso8601 string to a localized string with date and time */
    formatDateTime,
    /** Formats a Date object or iso8601 string to a localized date string, e.g. 22-05-2021, 05/22/2023 */
    formatDate,
    /** Formats a Date object or iso8601 string to a localized time string, e.g. 22:24, 10:24PM */
    formatTime,
    formatNumber,
    formatMoneyValue,
    /**  */
    formatMonth,
    formatDateTimeGeneric,
  };
}
