import { Ref, watch } from "vue";
import { useRoute, useRouter } from "@/router";
import { useMediakiwiStore } from "@/stores";
import { Paging, SortDirection, Sorting, TableFilter } from "@/models";
import { LocationQuery, LocationQueryValue } from "vue-router";

export function useFilterInQuery<T>(filtersModel?: Ref<TableFilter>, pagingModel?: Ref<Paging>, sortingModel?: Ref<Sorting<T>>) {
  const mediakiwiStore = useMediakiwiStore();
  const router = useRouter();
  const route = useRoute();

  const desiredQuery = () => {
    let query = Object.assign({}, route.query);;

    for (const name in filtersModel?.value) {
      const filter = filtersModel?.value[name];
      const selectedValue = filter.selectedValue;

      const filterValue = filter?.toUrl && selectedValue ? filter.toUrl(selectedValue) : selectedValue?.value;

      query = updateQueryWithValue(query, name, filterValue);
    }

    query = updateQueryWithValue(query, "pageIndex", pagingModel?.value.pageIndex?.toString());
    query = updateQueryWithValue(query, "pageSize", pagingModel?.value.pageSize?.toString());
    query = updateQueryWithValue(query, "sortBy", sortingModel?.value.sortBy?.toString());
    query = updateQueryWithValue(query, "sortDirection", sortingModel?.value.sortDirection?.toString());

    return query;
  };

  const updateQueryWithValue = (query: LocationQuery, name: string, value: string | undefined) => {
    if (value) {
      query[name] = value;
    } else {
      delete query[name];
    }
    return query;
  };

  const updateQueryAfterChange = async () => {
    await router.replace({ ...route, query: desiredQuery() });
    configureBackControl();
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

  const toString = (queryValue: LocationQueryValue | LocationQueryValue[]): string | string[] => {
    return Array.isArray(queryValue) ? queryValue.filter(q => !!q).map(q => q!.toString()) : queryValue?.toString() ?? '';
  }

  const loadFromQuery = () => {
    const query = route.query;

    for (const filterName in filtersModel?.value) {
      if (filterName in query) {
        const filter = filtersModel.value[filterName];

        if (filter?.fromUrl) {
          const filterValue = filter.fromUrl(toString(query[filterName]));
          filtersModel.value[filterName].selectedValue = filterValue;
        }
        else {
          const filterValue = query[filterName];

          const option = filtersModel.value[filterName].options?.find((x) => x.value.toString() == filterValue!.toString());
          filtersModel.value[filterName].selectedValue = option ? option : { value: filterValue };
        }
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
