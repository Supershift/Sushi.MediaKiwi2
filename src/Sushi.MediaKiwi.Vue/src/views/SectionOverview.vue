<script setup lang="ts">
  import { MkTable } from "@/components";
  import { TableMap, ListResult, Section, Paging } from "@/models";
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { SectionConnector } from "@/services";

  // inject dependencies
  const sectionConnector = container.resolve<SectionConnector>("ISectionConnector");

  // define reactive variables
  const data = ref<ListResult<Section>>();
  const currentPagination = ref<Paging>({});

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
    data.value = await sectionConnector.GetSections(currentPagination.value);
  }
</script>
<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    new
    :api-result="data"
    :on-load="onLoad"
    :table-map="tableMap"
    item-view-id="MkSectionEdit"
  ></mk-table>
</template>
