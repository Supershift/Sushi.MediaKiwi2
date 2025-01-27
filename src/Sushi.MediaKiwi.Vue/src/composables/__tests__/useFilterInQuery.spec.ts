import { describe, it, expect } from "vitest";
import { useFilterInQuery } from "@/composables/useFilterInQuery";
import { ref } from "vue";
import { TableFilter, Paging, Sorting, SortDirection, Locale } from "@/models";
import { RouteLocationAsPathGeneric } from "vue-router";

const routerReplaceMethod = vi.fn(() => { });
let mediakiwiStore = { navigationBackUrlOverwrite: new Map<string, RouteLocationAsPathGeneric>() };

vi.mock("@/router", () => ({
  useRoute: () => ({
    name: 'routeName',
    query: {
      id: "1337",
      name: "testname",
      parents: [123, 456],
      pageIndex: "41",
      pageSize: "42",
      sortBy: "isEnabled",
      sortDirection: "desc",
    },
    path: "/test/path",
  }),
  useRouter: () => ({
    replace: routerReplaceMethod,
  }),
}));

vi.mock("@/stores", () => ({
  useMediakiwiStore: () => mediakiwiStore,
}));

describe("useFilterInQuery", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mediakiwiStore = { navigationBackUrlOverwrite: new Map<string, RouteLocationAsPathGeneric>() };
  });

  it("filters are set from query", () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" }, parents: { title: "tes3" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);

    expect(filtersModel.value["id"].selectedValue?.value).toBe("1337");
    expect(filtersModel.value["name"].selectedValue?.value).toBe("testname");
    expect(filtersModel.value["parents"].selectedValue?.value).toHaveLength(2);
    expect(filtersModel.value["parents"].selectedValue?.value).toEqual(expect.arrayContaining([123, 456]));
  });

  it("pageIndex & pageSize set from query", () => {
    const filtersModel = ref<TableFilter>({});
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);

    expect(pagingModel.value.pageIndex).toBe(41);
    expect(pagingModel.value.pageSize).toBe(42);
  });

  it("sortBy & sortDirection set from query", () => {
    const filtersModel = ref<TableFilter>({});
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);

    expect(sortingModel.value.sortBy).toBe("isEnabled");
    expect(sortingModel.value.sortDirection).toBe("desc");
  });

  it("query is updated after filter is changed", async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" }, parents: { title: "tes3" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    filtersModel.value["id"].selectedValue = { value: "1337" };
    filtersModel.value["name"].selectedValue = { value: "blabla" };
    filtersModel.value["parents"].selectedValue = { value: [123, 456] };

    await vi.waitFor(() => {
      expect(routerReplaceMethod).toHaveBeenCalledTimes(1);
      expect(routerReplaceMethod.mock.calls[0]).toMatchObject([{ query: { id: "1337", name: "blabla", parents: [123, 456] } }]);
    });
  });

  it("query is updated after paging is changed", async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    pagingModel.value.pageIndex = 5;

    await vi.waitFor(() => {
      expect(routerReplaceMethod).toHaveBeenCalledTimes(1);
      expect(routerReplaceMethod.mock.calls[0]).toMatchObject([{ query: { pageIndex: "5" } }]);
    });
  });

  it("query is updated after sorting is changed", async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    sortingModel.value.sortBy = "id";
    sortingModel.value.sortDirection = SortDirection.Desc;

    await vi.waitFor(() => {
      expect(routerReplaceMethod).toHaveBeenCalledTimes(1);
      expect(routerReplaceMethod.mock.calls[0]).toMatchObject([{ query: { sortBy: "id", sortDirection: "DESC" } }]);
    });
  });

  it("configureBackControl is updated after query is changed", async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" }, parents: { title: "tes3" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    filtersModel.value["id"].selectedValue = { value: "1337" };
    filtersModel.value["name"].selectedValue = { value: "blabla" };
    filtersModel.value["parents"].selectedValue = { value: [123, 456] };

    await vi.waitFor(() => {
      expect(mediakiwiStore.navigationBackUrlOverwrite.get('routeName')).toMatchObject({ query: { id: "1337", name: "blabla", parents: [123, 456] }, path: "/test/path" });
    });
  });

  it("configureBackControl is updated after paging is changed", async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    pagingModel.value.pageIndex = 5;

    await vi.waitFor(() => {
      expect(mediakiwiStore.navigationBackUrlOverwrite.get('routeName')).toMatchObject({ query: { pageIndex: "5" }, path: "/test/path" });
    });
  });

  it("configureBackControl is updated after sorting is changed", async () => {
    const filtersModel = ref<TableFilter>({ id: { title: "tes1" }, name: { title: "tes2" } });
    const pagingModel = ref<Paging>({});
    const sortingModel = ref<Sorting<Locale>>({ sortBy: "name", sortDirection: SortDirection.Asc });

    useFilterInQuery<Locale>(filtersModel, pagingModel, sortingModel);
    sortingModel.value.sortBy = "id";
    sortingModel.value.sortDirection = SortDirection.Desc;

    await vi.waitFor(() => {
      expect(mediakiwiStore.navigationBackUrlOverwrite.get('routeName')).toMatchObject({ query: { sortBy: "id", sortDirection: "DESC" }, path: "/test/path" });
    });
  });
});
