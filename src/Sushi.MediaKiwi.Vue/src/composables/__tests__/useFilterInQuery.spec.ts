import { describe, it, expect } from 'vitest';
import useFilterInQuery from '@/composables/useFilterInQuery';
import { ref } from 'vue';
import { TableFilter, Paging, Sorting, SortDirection, Locale } from '@/models';

const routerReplaceMethod = vi.fn(() => { });
let mediakiwiStore = { navigationBackUrlOverwrite: "a" };

vi.mock("@/router", () => ({
  useRoute: () => ({
    query: {
      "id": "1337", "name": "testname",
      "pageIndex": "41",
      "pageSize": "42",
      "sortBy": "isEnabled",
      "sortDirection": "desc",
    },
  }),
  useRouter: () => ({
    replace: routerReplaceMethod,
  }),
}));

vi.mock("@/stores", () => ({
  useMediakiwiStore: () => mediakiwiStore,
}));

describe('useFilterInQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mediakiwiStore = { navigationBackUrlOverwrite: "a" };
  });

  it('filters are set from query', () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);

    expect(filtersModel.value["id"].selectedValue?.value).toBe('1337');
    expect(filtersModel.value["name"].selectedValue?.value).toBe('testname');
  });

  it('pageIndex & pageSize set from query', () => {
    const filtersModel = ref<TableFilter>({});
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);

    expect(pagingModel.value.pageIndex).toBe(41);
    expect(pagingModel.value.pageSize).toBe(42);
  });

  it('sortBy & sortDirection set from query', () => {
    const filtersModel = ref<TableFilter>({});
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);

    expect(sortingModel.value.sortBy).toBe("isEnabled");
    expect(sortingModel.value.sortDirection).toBe("desc");
  });

  it('query is updated after filter is changed', async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    filtersModel.value["id"].selectedValue = { value: "1337" };
    filtersModel.value["name"].selectedValue = { value: "blabla" };

    await vi.waitFor(() => {
      expect(routerReplaceMethod).toHaveBeenCalledTimes(1);
      expect(routerReplaceMethod.mock.calls[0]).toMatchObject([{ query: { "id": "1337", "name": "blabla" } }]);
    });
  });

  it('query is updated after paging is changed', async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    pagingModel.value.pageIndex = 5;

    await vi.waitFor(() => {
      expect(routerReplaceMethod).toHaveBeenCalledTimes(1);
      expect(routerReplaceMethod.mock.calls[0]).toMatchObject([{ query: { "pageIndex": "5" } }]);
    });
  });

  it('query is updated after sorting is changed', async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    sortingModel.value.sortBy = 'id';
    sortingModel.value.sortDirection = SortDirection.Desc;

    await vi.waitFor(() => {
      expect(routerReplaceMethod).toHaveBeenCalledTimes(1);
      expect(routerReplaceMethod.mock.calls[0]).toMatchObject([{ query: { "sortBy": "id", "sortDirection": "DESC" } }]);
    });
  });

  it('configureBackControl is updated after query is changed', async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    filtersModel.value["id"].selectedValue = { value: "1337" };
    filtersModel.value["name"].selectedValue = { value: "blabla" };

    await vi.waitFor(() => {
      expect(mediakiwiStore.navigationBackUrlOverwrite).toMatchObject({ query: { "id": "1337", "name": "blabla" } });
    });
  });

  it('configureBackControl is updated after paging is changed', async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    pagingModel.value.pageIndex = 5;

    await vi.waitFor(() => {
      expect(mediakiwiStore.navigationBackUrlOverwrite).toMatchObject({ query: { "pageIndex": "5" } });
    });
  });

  it('configureBackControl is updated after sorting is changed', async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: 'name', sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    sortingModel.value.sortBy = 'id';
    sortingModel.value.sortDirection = SortDirection.Desc;

    await vi.waitFor(() => {
      expect(mediakiwiStore.navigationBackUrlOverwrite).toMatchObject({ query: { "sortBy": "id", "sortDirection": "DESC" } });
    });
  });
});