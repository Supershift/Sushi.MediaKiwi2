<script setup lang="ts">
  import { MkTable, MkTh } from "@/components";
  import { ListResult, Paging, NavigationItemDto, TableFilterType, TableFilter, Sorting, SortDirection } from "@/models";
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
  const sections = ref(store.navigationTree.sections);

  const state = reactive({
    navigationItems: <ListResult<NavigationItemDto>>{},
  });

  // create a sorting option object with a default value
  const sorting = ref<Sorting<NavigationItemDto>>({
    sortBy: "name",
    sortDirection: SortDirection.Asc,
  });

  const filters = ref<TableFilter>({
    section: {
      title: "Section",
      options: sections.value.map((x) => ({ title: x.name, value: x.id })),
      type: TableFilterType.SingleSelect,
    },
  });

  function getSectionName(id: string): string | undefined {
    return sections.value.find((section) => section.id == id)?.name;
  }

  function getNavigationItemName(id?: string): string | undefined {
    return state.navigationItems.result.find((x) => x.id == id)?.name || "-";
  }

  // get data
  async function onLoad() {
    state.navigationItems = await navigationConnector.GetNavigationItems(filters.value.section?.selectedValue?.value, currentPagination.value, sorting.value);
  }
</script>
<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    new
    :api-result="state.navigationItems"
    @load="onLoad"
    navigation-item-id="MkNavigationItemEdit"
    :item-id="(item) => item.id"
  >
    <template #thead>
      <MkTh v-model:sorting="sorting" sorting-key="id">Id</MkTh>
      <MkTh v-model:sorting="sorting" sorting-key="name">Name</MkTh>
      <MkTh v-model:sorting="sorting" sorting-key="sectionId">Section</MkTh>
      <MkTh v-model:sorting="sorting" sorting-key="parentNavigationItemId">Parent</MkTh>
      <th>View</th>
      <th>Icon</th>
      <MkTh v-model:sorting="sorting" sorting-key="sortOrder" width="140">Sort order</MkTh>
    </template>
    <template #tbody="{ dataItem }">
      <th>{{ dataItem.id }}</th>
      <td>{{ dataItem.name }}</td>
      <td>{{ getSectionName(dataItem.sectionId) }}</td>
      <td>{{ getNavigationItemName(dataItem.parentNavigationItemId) }}</td>
      <td>{{ dataItem.viewId }}</td>
      <td>{{ dataItem.icon }}</td>
      <td>{{ dataItem.sortOrder }}</td>
    </template>
  </mk-table>
</template>
