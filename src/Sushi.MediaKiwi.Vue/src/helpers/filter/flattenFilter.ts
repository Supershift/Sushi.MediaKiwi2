import { TableFilter, TableFilterItem } from "@/models";

export function flattenFilter(tableFilter: TableFilter): Record<string, TableFilterItem> {
  let result: Record<string, TableFilterItem> = {};

  for (const key of Object.keys(tableFilter)) {
    const filterItem = tableFilter[key];

    if (!filterItem) continue;

    result[key] = filterItem;

    if (filterItem.children) {
      const children = flattenFilter(filterItem.children);
      result = { ...result, ...children };
    }
  }

  return result;
}
