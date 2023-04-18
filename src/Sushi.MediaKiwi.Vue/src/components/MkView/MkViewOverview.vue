<script setup lang="ts">
  import { MkTable } from "../MkTable";
  import { TableMap, ListResult } from "@/models";
  import { View } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { IViewConnector } from "@/services";
  import { TableFilter } from "@/models/table/TableFilter";
  import { TableFilterType } from "../../models/enum/TableFilterType";

  // inject dependencies
  const viewConnector = container.resolve<IViewConnector>("IViewConnector");
  const store = useMediakiwiStore();

  // define reactive variables
  const sections = ref(store.sections);
  const data = ref<ListResult<View>>();
  const currentPage = ref(1);

  // define mapping
  const tableMap: TableMap<View> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Name", value: (x) => x.name },
      { headerTitle: "ExternalId", value: (x) => x.externalId },
      { headerTitle: "Section", value: (x) => sections.value.find((section) => section.id == x.sectionId)?.name },
      { headerTitle: "Component Key", value: (x) => x.componentKey },
      { headerTitle: "Parameter", value: (x) => x.parameterName },
      { headerTitle: "Roles", value: (x) => x.roles?.join() },
    ],
  };

  // define filters
  const filters = ref<TableFilter>({
    section: {
      title: "Section",
      options: sections.value.map((x) => ({ title: x.name, value: x.id })),
      type: TableFilterType.Select,
    },
  });

  // get data
  async function loadData() {
    data.value = await viewConnector.GetViews(filters.value.section?.selectedValue?.value, { pageIndex: currentPage.value - 1, pageSize: 10 });
  }
</script>
<template>
  <mk-table new :api-result="data" :on-need-data="loadData" :table-map="tableMap" v-model:filters="filters" v-model:current-page="currentPage" item-view-id="ViewEdit"></mk-table>
</template>
