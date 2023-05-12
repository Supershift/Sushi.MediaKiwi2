<script setup lang="ts">
  import { MkTable } from "../MkTable";
  import { TableMap, ListResult, TableFilterItem, Sorting } from "@/models";
  import { View } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { IViewConnector } from "@/services";
  import { TableFilterType } from "../../models/enum/TableFilterType";
  import { watch } from "vue";

  // inject dependencies
  const viewConnector = container.resolve<IViewConnector>("IViewConnector");
  const store = useMediakiwiStore();

  // define reactive variables
  const sections = ref(store.sections);
  const data = ref<ListResult<View>>();
  const currentPage = ref(0);

  // define mapping
  const tableMap: TableMap<View> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Name", value: (x) => x.name, sortingOptions: { id: (x) => x.name } },
      { headerTitle: "ExternalId", value: (x) => x.externalId },
      { headerTitle: "Section", value: (x) => sections.value.find((section) => section.id == x.sectionId)?.name },
      { headerTitle: "Component Key", value: (x) => x.componentKey },
      { headerTitle: "Parameter", value: (x) => x.parameterName },
      { headerTitle: "Roles", value: (x) => x.roles?.join() },
    ],
  };

  // define filters
  interface SectionFilter {
    section: TableFilterItem;
  }
  const filters = ref<SectionFilter>({
    section: {
      title: "Section",
      options: sections.value.map((x) => ({ title: x.name, value: x.id })),
      type: TableFilterType.Select,
    },
  });

  // create a sorting option object with a default value
  const selectedSortOption = ref<Sorting>();

  async function getData() {
    data.value = await viewConnector.GetViews(
      filters.value.section?.selectedValue?.value,
      { pageIndex: currentPage.value, pageSize: 10 },
      selectedSortOption.value
    );
  }

  // get data
  async function onLoad() {
    await getData();
  }

  watch(
    () => selectedSortOption.value,
    () => {
      onLoad();
    }
  );
</script>
<template>
  <mk-table
    v-model:filters="filters"
    v-model:current-page="currentPage"
    v-model:selected-sort-option="selectedSortOption"
    new
    :api-result="data"
    :on-load="onLoad"
    :table-map="tableMap"
    item-view-id="ViewEdit"
  ></mk-table>
</template>
