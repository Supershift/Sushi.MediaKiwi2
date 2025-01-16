import { Ref, watch } from "vue";
import { useRoute, useRouter } from "@/router";
import { useMediakiwiStore } from "@/stores";
import { Paging, SortDirection, Sorting, TableFilter } from "@/models";

export function useFilterInQuery<T>(filtersModel?: Ref<TableFilter>, pagingModel?: Ref<Paging>, sortingModel?: Ref<Sorting<T>>) {
  const mediakiwiStore = useMediakiwiStore();
  const router = useRouter();
  const route = useRoute();

  const desiredQuery = () => {
    const query = queryToMap();

    for (const name in filtersModel?.value) {
      const filterValue = filtersModel?.value[name].selectedValue?.value;
      updateQueryWithValue(query, name, filterValue);
    }

    updateQueryWithValue(query, "pageIndex", pagingModel?.value.pageIndex?.toString());
    updateQueryWithValue(query, "pageSize", pagingModel?.value.pageSize?.toString());
    updateQueryWithValue(query, "sortBy", sortingModel?.value.sortBy?.toString());
    updateQueryWithValue(query, "sortDirection", sortingModel?.value.sortDirection?.toString());

    return Object.fromEntries(query);
  };

  const updateQueryWithValue = (query: Map<string, string | null | undefined>, name: string, value: string | undefined) => {
    if (value) {
      query.set(name, value);
    } else {
      query.delete(name);
    }
  };

  const updateQueryAfterChange = () => {
    router.replace({ ...route, ...{ query: desiredQuery() } });
    configureBackControl();
  };

  const queryToMap = () => {
    const queryAsMap = new Map<string, string | null | undefined>();

    for (const query in route.query) {
      queryAsMap.set(query, route.query[query]?.toString() ?? "");
    }

    return queryAsMap;
  };

  const configureBackControl = () => {
    if (
      Object.values(filtersModel?.value ?? []).filter((f) => !!f.selectedValue).length !== 0 ||
      pagingModel?.value.pageIndex !== 0 ||
      pagingModel?.value.pageSize !== 0 ||
      sortingModel?.value.sortBy ||
      sortingModel?.value.sortDirection
    ) {
      mediakiwiStore.navigationBackUrlOverwrite.set(route.name?.toString() || "", { ...route, query: desiredQuery() });
    } else {
      mediakiwiStore.navigationBackUrlOverwrite.delete(route.name?.toString() || "");
    }
  };

  const loadFromQuery = () => {
    const query = route.query;

    for (const filterName in filtersModel?.value) {
      if (filterName in query) {
        const filterValue = query[filterName];
        const option = filtersModel.value[filterName].options?.find((x) => x.value.toString() == filterValue!.toString());
        filtersModel.value[filterName].selectedValue = option ? option : { value: filterValue };
      }
    }

    if (pagingModel && "pageIndex" in query) {
      pagingModel.value.pageIndex = parseInt((query["pageIndex"] as string) ?? "0");
    }

    if (pagingModel && "pageSize" in query) {
      pagingModel.value.pageSize = parseInt((query["pageSize"] as string) ?? "0");
    }

    if (sortingModel && "sortBy" in query) {
      sortingModel.value.sortBy = query["sortBy"] as keyof T;
    }

    if (sortingModel && "sortDirection" in query) {
      sortingModel.value.sortDirection = query["sortDirection"] as SortDirection;
    }
    configureBackControl();
  };

  loadFromQuery();

  if (filtersModel) {
    watch(filtersModel, updateQueryAfterChange, { deep: true });
  }

  if (pagingModel) {
    watch(pagingModel, updateQueryAfterChange, { deep: true });
  }

  if (sortingModel) {
    watch(sortingModel, updateQueryAfterChange, { deep: true });
  }
}
