<script setup lang="ts">
  import { MkTable } from "../MkTable";
  import { TableMap, ListResult, Section } from "@/models";
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { SectionConnector } from "@/services";

  // inject dependencies
  const sectionConnector = container.resolve<SectionConnector>("ISectionConnector");

  // define reactive variables
  const data = ref<ListResult<Section>>();
  const currentPage = ref(1);

  // define mapping
  const tableMap: TableMap<Section> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Name", value: (x) => x.name },
      { headerTitle: "Icon", value: (x) => x.icon },
      { headerTitle: "Sort order", value: (x) => x.sortOrder },
    ],
  };

  // get data
  async function onLoad() {
    data.value = await sectionConnector.GetSections({ pageIndex: currentPage.value - 1, pageSize: 10 });
  }
</script>
<template>
  <mk-table v-model:current-page="currentPage" new :api-result="data" :on-load="onLoad" :table-map="tableMap" item-view-id="SectionEdit"></mk-table>
</template>
