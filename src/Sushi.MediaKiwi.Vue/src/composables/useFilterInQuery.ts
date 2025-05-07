import { Ref, watch } from "vue";
import { useRoute, useRouter } from "@/router";
import { useMediakiwiStore } from "@/stores";
import { Paging, SortDirection, Sorting, TableFilter, TableFilterItem, TableFilterValue } from "@/models";
import { LocationQuery, LocationQueryValue } from "vue-router";
import { flattenFilter } from "@/helpers/filter/flattenFilter";

export type TableFilterItemQueryConverter = TableFilterItem & {
  /** Override default behavior to save the filter in the url (default: toString()) */
  toUrl?: (value: TableFilterValue) => string | string[];

  /** Override default behavior to get the filter in the url (default: toString()) */
  fromUrl?: (value: string | string[]) => TableFilterValue | undefined;
};

export function useFilterInQuery<T>(filtersModel?: Ref<TableFilter>, pagingModel?: Ref<Paging>, sortingModel?: Ref<Sorting<T>>) {
  const mediakiwiStore = useMediakiwiStore();
  const router = useRouter();
  const route = useRoute();
  const query = route.query;

  loadFiltersFromQuery(query);
  loadPagingFromQuery(query);
  loadSortingFromQuery(query);

  configureBackControl();

  if (filtersModel) {
    watch(filtersModel, updateQueryAfterChange, { deep: true });
  }

  if (pagingModel) {
    watch(pagingModel, updateQueryAfterChange, { deep: true });
  }

  if (sortingModel) {
    watch(sortingModel, updateQueryAfterChange, { deep: true });
  }

  function loadFiltersFromQuery(query: LocationQuery) {
    const items = flattenFilter(filtersModel?.value ?? {});

    for (const filterName in items) {
      if (filterName in query) {
        const filter = items[filterName];

        if (isTableFilterItemWithExplicitQueryConversion(filter) && filter?.fromUrl) {
          const filterValue = filter.fromUrl(toString(query[filterName]));
          items[filterName].selectedValue = filterValue;
        } else {
          const filterValue = query[filterName];

          const option = items[filterName].options?.find((x) => x.value.toString() == filterValue!.toString());
          items[filterName].selectedValue = option ?? { value: filterValue };
        }
      }
    }
  }

  function loadPagingFromQuery(query: LocationQuery) {
    if (pagingModel) {
      if ("pageIndex" in query) {
        pagingModel.value.pageIndex = parseInt((query["pageIndex"] as string) ?? "0");
      }

      if ("pageSize" in query) {
        pagingModel.value.pageSize = parseInt((query["pageSize"] as string) ?? "0");
      }
    }
  }

  function loadSortingFromQuery(query: LocationQuery) {
    if (sortingModel) {
      if ("sortBy" in query) {
        sortingModel.value.sortBy = query["sortBy"] as keyof T;
      }

      if ("sortDirection" in query) {
        sortingModel.value.sortDirection = query["sortDirection"] as SortDirection;
      }
    }
  }

  async function updateQueryAfterChange() {
    await router.replace({ ...route, query: desiredQuery() });
    configureBackControl();
  }

  function desiredQuery() {
    let query = { ...route.query };

    const items = flattenFilter(filtersModel?.value ?? {});
    for (const name in items) {
      const filter = items[name];
      const selectedValue = filter.selectedValue;

      const filterValue =
        isTableFilterItemWithExplicitQueryConversion(filter) && filter?.toUrl && selectedValue ? filter.toUrl(selectedValue) : selectedValue?.value;

      query = updateQueryWithValue(query, name, filterValue);
    }

    query = updateQueryWithValue(query, "pageIndex", pagingModel?.value.pageIndex?.toString());
    query = updateQueryWithValue(query, "pageSize", pagingModel?.value.pageSize?.toString());
    query = updateQueryWithValue(query, "sortBy", sortingModel?.value.sortBy?.toString());
    query = updateQueryWithValue(query, "sortDirection", sortingModel?.value.sortDirection?.toString());

    return query;
  }

  function isTableFilterItemWithExplicitQueryConversion(item: TableFilterItem): item is TableFilterItemQueryConverter {
    return true;
  }

  function updateQueryWithValue(query: LocationQuery, name: string, value: string | undefined) {
    if (value) {
      query[name] = value;
    } else {
      delete query[name];
    }
    return query;
  }

  function configureBackControl() {
    if (
      Object.values(filtersModel?.value ?? []).filter((f) => !!f.selectedValue).length !== 0 ||
      pagingModel?.value.pageIndex !== 0 ||
      pagingModel?.value.pageSize !== 0 ||
      sortingModel?.value.sortBy ||
      sortingModel?.value.sortDirection
    ) {
      mediakiwiStore.navigationBackUrlOverwrite.set(route.name?.toString() ?? "", { ...route, query: desiredQuery() });
    } else {
      mediakiwiStore.navigationBackUrlOverwrite.delete(route.name?.toString() ?? "");
    }
  }

  function toString(queryValue: LocationQueryValue | LocationQueryValue[]): string | string[] {
    return Array.isArray(queryValue) ? queryValue.filter((q) => !!q).map((q) => q!.toString()) : (queryValue?.toString() ?? "");
  }
}
