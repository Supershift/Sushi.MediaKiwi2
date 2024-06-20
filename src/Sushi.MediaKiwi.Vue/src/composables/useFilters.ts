import { TableFilterItem, TableFilterType, TableFilterValue } from "@/models";
import { useDatePresets } from "./useDatePresets";
import { useI18next as useI18nextComposable } from "./useI18next";
import { FilterOperatorType, FilterOperatorTypeSymbol } from "@/models/table/filter/FilterOperatorType";
import { FilterOperatorValue } from "@/models/table/filter/FilterOperatorValue";

/** This composable provides filters for the table. */
export async function useFilters(useI18next: ReturnType<typeof useI18nextComposable>) {
  const { formatPreset } = await useDatePresets();
  const { formatDate, t } = await useI18next;

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
        // Get the start and end //date
        return formatPreset(value);
      }
      case TableFilterType.Operator: {
        const operatorValue = value as FilterOperatorValue<any>;
        return operatorValue?.value;
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
        return t.value("FilterContains", "{{filter.title}} contains {{filter.value}}", {
          filter: { title: tableFilterItem.title, value },
        });
      case TableFilterType.Operator: {
        const filterOperatorValue = tableFilterItem.selectedValue?.value as FilterOperatorValue<any>;

        let title;
        if (tableFilterItem.options && tableFilterItem.options.length) {
          title = tableFilterItem.options.find((o) => o.value === filterOperatorValue.operator)?.title;
        } else {
          title = FilterOperatorTypeSymbol.get(filterOperatorValue.operator);
        }

        return `${tableFilterItem.title}: ${title} ${value}`;
      }
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

  function getOperatorOptions(): TableFilterValue[] {
    const result = <TableFilterValue[]>[];

    Object.values(FilterOperatorType)
      ?.filter((x) => typeof x === "string")
      .forEach((operator) => {
        const filterOperatorType = FilterOperatorType[operator as keyof typeof FilterOperatorType];
        result.push({
          title: FilterOperatorTypeSymbol.get(filterOperatorType),
          value: filterOperatorType,
        });
      });

    return result;
  }

  return {
    getFormatterFilterValue,
    appliedFilterChip,
    getOperatorOptions,
  };
}
