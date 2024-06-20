import { TableFilterItem, TableFilterType } from "@/models";
import { useDatePresets } from "./useDatePresets";

/**
 * This composable provides filters for the table.
 * @param formatDate The function to format the date, getting i18Next from the context breaks the composable
 */
export async function useFilters(formatDate: (...args: any) => string) {
  const { formatPreset } = await useDatePresets();

  function getFormatterFilterValue(tableFilterItem: TableFilterItem) {
    const value = tableFilterItem.selectedValue?.value;
    const title = tableFilterItem.selectedValue?.title;

    if (title) {
      return title;
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
        const selectedOptions = tableFilterItem.options?.filter((o) => value.includes(o.value));
        return selectedOptions?.map((o) => o.title).join(", ");
      }
      case TableFilterType.DatePicker:
        return formatDate(value);
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
    const value = getFormatterFilterValue(tableFilterItem);

    switch (tableFilterItem.type) {
      case TableFilterType.Direct:
        return tableFilterItem.title;
      case TableFilterType.Contains:
        return `${tableFilterItem.title} contains ${value}`;
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
