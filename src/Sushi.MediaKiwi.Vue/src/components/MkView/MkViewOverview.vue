<script setup lang="ts">
  import { MkTable } from "../MkTable";
  import { ITableMap, ListResult, TableFilterValueCollection } from "@/models";
  import { View } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { ref } from "vue";
  import { storeToRefs } from "pinia";
  import { container } from "tsyringe";
  import { IViewConnector } from "@/services";
  import { MkTableFilterSelect } from "../MkTableFilter";
  import { TableFilter } from "@/models/table/ITableFilter";

  // inject dependencies
  const viewConnector = container.resolve<IViewConnector>("IViewConnector");
  const store = useMediakiwiStore();

  // define reactive variables
  const data = ref<ListResult<View>>();
  const currentPage = ref(1);
  const selectedFilters = ref({} as TableFilterValueCollection);

  // get data
  const { sections } = storeToRefs(store);

  async function loadData() {
    data.value = await viewConnector.GetViews(selectedFilters.value.section?.value, { pageIndex: currentPage.value - 1, pageSize: 10 });
  }

  // define mapping
  const tableMap: ITableMap<View> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Name", value: (x) => x.name },
      { headerTitle: "ExternalId", value: (x) => x.externalId },
      { headerTitle: "Component Key", value: (x) => x.componentKey },
      { headerTitle: "Section", value: (x) => sections.value.find((section) => section.id == x.sectionId)?.name },
      { headerTitle: "Roles", value: (x) => x.roles?.join() },
    ],
  };

  const filters: TableFilter = {
    section: {
      title: "Section",
      options: sections.value.map((x) => ({ title: x.name, value: x.id })),
      component: MkTableFilterSelect,
    },
  };
</script>
<template>
  <mk-table
    new
    :api-result="data"
    :on-need-data="loadData"
    :table-map="tableMap"
    :filter-map="filters"
    v-model:selected-filters="selectedFilters"
    v-model:current-page="currentPage"
    item-view-id="ViewEdit"
  ></mk-table>
</template>
