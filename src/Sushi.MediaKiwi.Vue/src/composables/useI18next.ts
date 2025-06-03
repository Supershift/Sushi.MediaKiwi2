import { identity } from "@/identity";
import { MediakiwiVueOptions, MoneyValue } from "@/models";
import { tokenStore } from "@/plugins/i18next";
import { i18n } from "i18next";
import { Ref, computed, inject } from "vue";
import { useNavigation } from "@/composables/useNavigation";
import { container } from "tsyringe";
import { NavigationItem } from "@/models/navigation";
import { DateTime, DateTimeFormatOptions } from "luxon";
/**
 * Adds i18next to the component.
 * @param scope If provided, the t function will be scoped to this namespace. If left undefined, it will be scoped to the current Navigation item's id.
 * @returns
 */
export async function useI18next(scope?: NavigationItem | string) {
  // inject dependencies
  const navigation = useNavigation();

  // get i18next instance
  let i18next: Ref<i18n> | undefined;
  if (container.isRegistered("i18next")) {
    i18next = container.resolve<Ref<i18n>>("i18next");
  } else {
    i18next = inject<Ref<i18n>>("i18next");
  }

  // get mediakiwi options
  let mediakiwiOptions: MediakiwiVueOptions | undefined;
  if (container.isRegistered("MediakiwiOptions")) {
    mediakiwiOptions = container.resolve<MediakiwiVueOptions>("MediakiwiOptions");
  } else {
    mediakiwiOptions = inject<MediakiwiVueOptions>("mediakiwi");
  }

  // check if i18next is provided
  if (!i18next) {
    throw new Error("i18next is not provided, install the plugin first");
  }

  // get i18next initialization promise
  let i18nInitPromise: Promise<any> | undefined;
  if (container.isRegistered("i18initPromise")) {
    i18nInitPromise = container.resolve<Promise<any>>("i18initPromise");
  } else {
    i18nInitPromise = inject<Promise<any>>("i18initPromise");
  }

  // check if i18next is initialized
  await i18nInitPromise;

  // determine namespace
  if (!scope) {
    scope = navigation.currentNavigationItem.value;
    if (!scope) scope = "common";
  }

  const namespace = typeof scope === "string" ? scope : scope.id;

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
  const dateOptions = computed(() => mediakiwiOptions?.dateFormatOptions?.date || DateTime.DATE_SHORT);
  const timeOptions = computed(() => mediakiwiOptions?.dateFormatOptions?.time || DateTime.TIME_SIMPLE);
  const monthOptions = computed(() => mediakiwiOptions?.dateFormatOptions?.month || <Intl.DateTimeFormatOptions>{ month: "long" });

  type DateTypes = string | Date | DateTime | undefined | null;

  const formatDateTimeInternal = (date: DateTypes, options?: DateTimeFormatOptions): string => {
    return formatDateTimeGenericInternal(date, { ...dateOptions.value, ...timeOptions.value, ...options });
  };

  const formatDateInternal = (date: DateTypes, options?: DateTimeFormatOptions): string => {
    return formatDateTimeGenericInternal(date, { ...dateOptions.value, ...options });
  };

  const formatTimeInternal = (date: DateTypes, options?: DateTimeFormatOptions): string => {
    return formatDateTimeGenericInternal(date, { ...timeOptions.value, ...options });
  };

  const formatWeekInternal = (date: DateTypes, options?: DateTimeFormatOptions): string => {
    const dateTime = inputToDateTime(date);

    if (!dateTime) {
      return "";
    }

    return dateTime
      .setLocale(i18next.value.resolvedLanguage ?? 'en-US')
      .toLocal()
      .toFormat("n");
  };

  const formatMonthInternal = (date: DateTypes, options?: DateTimeFormatOptions): string => {
    return formatDateTimeGenericInternal(date, { ...monthOptions.value, ...options });
  };

  const inputToDateTime = (date: DateTypes) => {
    if (!date) return undefined;

    if (date instanceof Date) {
      return DateTime.fromJSDate(date);
    }

    if (typeof date === 'string') {
      return DateTime.fromISO(date);
    }

    return date;
  }

  const formatDateTimeGenericInternal = (date: DateTypes, options?: DateTimeFormatOptions): string => {
    const dateTime = inputToDateTime(date);

    if (!dateTime) {
      return "";
    }

    return dateTime
      .setLocale(i18next.value.resolvedLanguage ?? 'en-US')
      .toLocal()
      .toLocaleString(options);
  };

  const formatDateTime = computed(() => formatDateTimeInternal);
  const formatDate = computed(() => formatDateInternal);
  const formatTime = computed(() => formatTimeInternal);
  const formatWeek = computed(() => formatWeekInternal);
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

  /**
   * Converts bytes to a human-readable format.
   * @param bytes The size in bytes to be converted.
   * @param decimals (Optional) The number of decimal places to round to. Defaults to 2.
   * @returns A string representing the size in a human-readable format.
   */
  const formatBytesInteral = (bytes: number, decimals: number = 2) => {
    // Define the base for conversion (1000 bytes = 1 kilobyte)
    const base = 1000;

    // Define the units for display
    const units = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    // Calculate the index of the appropriate unit
    const unitIndex = Math.floor(Math.log(bytes) / Math.log(base));

    // Calculate the size in the chosen unit
    const size = bytes / Math.pow(base, unitIndex);

    // Return the size formatted with the appropriate unit
    return `${formatNumber.value(size, {
      maximumFractionDigits: decimals,
    })} ${units[unitIndex]}`;
  };

  const formatBytes = computed(() => formatBytesInteral);

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
    formatWeek,
    formatMonth,
    formatDateTimeGeneric,
    formatBytes,
  };
}
