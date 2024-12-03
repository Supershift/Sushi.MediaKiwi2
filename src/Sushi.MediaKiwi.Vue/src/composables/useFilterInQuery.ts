import { Ref, watch } from "vue";
import { useRoute, useRouter } from "@/router";
import { useMediakiwiStore } from "@/stores";
import { Paging, SortDirection, Sorting, TableFilter } from "@/models";

/*
Will try to fill the given filter+paging+sorting models from the query parameters.
After that, when the models are changed, it will update the query parameters.

Will also save the full uri to pinia, so it can be used in certain 'back' scenarios.

Please note that this function currently does not support nesting.
*/
export default function useFilterInQuery<T>(
  filtersModel?: Ref<TableFilter>,
  pagingModel?: Ref<Paging>,
  sortingModel?: Ref<Sorting<T>>,
) {
  const mediakiwiStore = useMediakiwiStore();
  const router = useRouter();
  const route = useRoute();

  const desiredQuery = () => {
    const query = queryToMap();

    for (const name in filtersModel?.value) {
      const filterValue = filtersModel?.value[name].selectedValue?.value;
      updateQueryWithValue(query, name, filterValue);
    }

    updateQueryWithValue(
      query,
      "pageIndex",
      pagingModel?.value.pageIndex?.toString(),
    );
    updateQueryWithValue(
      query,
      "pageSize",
      pagingModel?.value.pageSize?.toString(),
    );
    updateQueryWithValue(
      query,
      "sortBy",
      sortingModel?.value.sortBy?.toString(),
    );
    updateQueryWithValue(
      query,
      "sortDirection",
      sortingModel?.value.sortDirection?.toString(),
    );

    return Object.fromEntries(query);
  };

  const updateQueryWithValue = (
    query: Map<string, string | null | undefined>,
    name: string,
    value: string | undefined,
  ) => {
    if (value) {
      query.set(name, value);
    } else {
      query.delete(name);
    }
  };

  const updateQueryAfterChange = () => {
    router.replace({ name: route.name || undefined, query: desiredQuery() });
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
      Object.values(filtersModel?.value ?? []).filter((f) => !!f.selectedValue)
        .length !== 0 ||
      pagingModel?.value.pageIndex !== 0 ||
      pagingModel?.value.pageSize !== 0 ||
      sortingModel?.value.sortBy ||
      sortingModel?.value.sortDirection
    ) {
      mediakiwiStore.navigationBackUrlOverwrite = {
        name: route.name || undefined,
        query: desiredQuery(),
      };
    } else {
      mediakiwiStore.navigationBackUrlOverwrite = undefined;
    }
  };

  const loadFromQuery = () => {
    const query = queryToMap();

    for (const filterName in filtersModel?.value) {
      if (query.has(filterName)) {
        const filterValue = query.get(filterName);

        const option = filtersModel.value[filterName].options?.find(
          (x) => x.value.toString() == filterValue,
        );

        filtersModel.value[filterName].selectedValue = option
          ? option
          : { value: filterValue };
      }
    }

    if (pagingModel && query.has("pageIndex")) {
      pagingModel.value.pageIndex = parseInt(query.get("pageIndex") ?? "0");
    }

    if (pagingModel && query.has("pageSize")) {
      pagingModel.value.pageSize = parseInt(query.get("pageSize") ?? "0");
    }

    if (sortingModel && query.has("sortBy")) {
      sortingModel.value.sortBy = query.get("sortBy") as keyof T;
    }

    if (sortingModel && query.has("sortDirection")) {
      sortingModel.value.sortDirection = query.get(
        "sortDirection",
      ) as SortDirection;
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
