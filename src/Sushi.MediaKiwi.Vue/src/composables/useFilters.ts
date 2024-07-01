import { TableFilterItem, TableFilterType } from "@/models";
import { useDatePresets } from "./useDatePresets";
import { useI18next as useI18nextComposable } from "./useI18next";

/** This composable provides filters for the table. */
export async function useFilters(useI18next: ReturnType<typeof useI18nextComposable>) {
  const { formatPreset } = await useDatePresets();
  const { formatDate, defaultT } = await useI18next;

  function getFormatterFilterValue(tableFilterItem: TableFilterItem) {
    const value = tableFilterItem.selectedValue?.value;
    const title = tableFilterItem.selectedValue?.title;

    if (title) {
      return title;
    }

    if (!value) {
      return;
    }

    switch (tableFilterItem.type) {
      case TableFilterType.Direct:
        return;
      case TableFilterType.SingleSelect:
      case TableFilterType.RadioGroup:
      case TableFilterType.Select: {
        const selectedOption = tableFilterItem.options?.find((o) => o.value === value);
        return selectedOption?.title || "";
      }
      case TableFilterType.MultiSelect:
      case TableFilterType.SelectMultipleCheckbox:
      case TableFilterType.SelectMultiple: {
        const selectedOptions = tableFilterItem.options?.filter((o) => value?.includes(o.value));
        return selectedOptions?.map((o) => o.title).join(", ");
      }
      case TableFilterType.DatePicker:
        return formatDate.value(value);
      case TableFilterType.DateRange: {
        // Get the start and end date
        return formatPreset(value);
      }
      default:
      case TableFilterType.Custom:
      case TableFilterType.Contains:
      case TableFilterType.TextField:
        return value;
    }
  }

  function appliedFilterChip(tableFilterItem: TableFilterItem) {
    if (!tableFilterItem.selectedValue) {
      return;
    }

    const value = getFormatterFilterValue(tableFilterItem);

    switch (tableFilterItem.type) {
      case TableFilterType.Direct:
        return tableFilterItem.title;
      case TableFilterType.Contains:
        return defaultT.value("Filter.Contains", "{{filter.title}} contains {{filter.value}}", {
          filter: { title: tableFilterItem.title, value },
        });
      case TableFilterType.DatePicker:
      case TableFilterType.DateRange:
      case TableFilterType.TextField:
      case TableFilterType.SingleSelect:
      case TableFilterType.RadioGroup:
      case TableFilterType.Select:
      case TableFilterType.MultiSelect:
      case TableFilterType.SelectMultipleCheckbox:
      case TableFilterType.SelectMultiple:
      case TableFilterType.Custom:
      default: {
        const title = tableFilterItem.title;
        return `${title}${value ? ": " : ""}${value}`;
      }
    }
  }

  return {
    getFormatterFilterValue,
    appliedFilterChip,
  };
}
