<script setup lang="ts">
  import { MkTable, MkTh } from "@/components";
  import { ListResult, Paging, NavigationItem, TableFilterType, TableFilter, Sorting, SortDirection } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { INavigationConnector } from "@/services";
  import { reactive } from "vue";
  import { watch } from "vue";

  // inject dependencies
  const navigationConnector = container.resolve<INavigationConnector>("INavigationConnector");
  const store = useMediakiwiStore();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const sections = ref(store.sections);
  const navigationItems = ref(store.navigationItems);

  const state = reactive({
    navigationItems: <ListResult<NavigationItem>>{},
  });

  // create a sorting option object with a default value
  const sorting = ref<Sorting<NavigationItem>>({
    sortBy: "name",
    sortDirection: SortDirection.Asc,
  });

  const filters = ref<TableFilter>({
    section: {
      title: "Section",
      options: sections.value.map((x) => ({ title: x.name, value: x.id })),
      type: TableFilterType.Select,
    },
  });

  function getSectionName(id: number): string | undefined {
    return sections.value.find((section) => section.id == id)?.name;
  }

  function getNavigationItemName(id?: number): string | undefined {
    return navigationItems.value.find((x) => x.id == id)?.name || "-";
  }

  // get data
  async function onLoad() {
    state.navigationItems = await navigationConnector.GetNavigationItems(currentPagination.value, filters.value.section?.selectedValue?.value, sorting.value);
  }

  // TODO; Move this to the MkTable component, it should be able to handle this itself
  watch(() => sorting.value, onLoad, { deep: true });
</script>
<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    new
    :api-result="state.navigationItems"
    @load="onLoad"
    item-view-id="MkNavigationItemEdit"
    :item-id="(item) => item.id"
  >
    <template #thead>
      <MkTh v-model:sorting="sorting" sorting-key="name">Name</MkTh>
      <th>Section</th>
      <th>Parent</th>
      <th>View</th>
      <th>Icon</th>
      <MkTh v-model:sorting="sorting" sorting-key="sortOrder" width="140">Sort order</MkTh>
    </template>
    <template #tbody="item: NavigationItem">
      <td>{{ item.name }}</td>
      <td>{{ getSectionName(item.sectionId) }}</td>
      <td>{{ getNavigationItemName(item.parentNavigationItemId) }}</td>
      <td>{{ item.viewId }}</td>
      <td>{{ item.icon }}</td>
      <td>{{ item.sortOrder }}</td>
    </template>
  </mk-table>
</template>
