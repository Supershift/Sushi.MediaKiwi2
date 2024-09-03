<script setup lang="ts">
  import { MkTable } from "@/components";
  import { TableMap, ListResult, Sorting, Paging } from "@/models";
  import { ViewDto } from "@/models";
  import { ref } from "vue";
  import { container } from "tsyringe";
  import { IViewConnector } from "@/services";

  // inject dependencies
  const viewConnector = container.resolve<IViewConnector>("IViewConnector");

  // define reactive variables
  const data = ref<ListResult<ViewDto>>();
  const currentPagination = ref<Paging>({});
  const sorting = ref<Sorting | undefined>();

  // define mapping
  const tableMap: TableMap<ViewDto> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Id", value: (x) => x.id },
      { headerTitle: "Name", value: (x) => x.name, sortingOptions: { id: (x) => x.name } },
      { headerTitle: "Component Key", value: (x) => x.componentKey },
      { headerTitle: "Parameter", value: (x) => x.parameterName },
      { headerTitle: "Roles", value: (x) => x.roles?.join() },
    ],
  };

  // get data
  async function onLoad() {
    data.value = await viewConnector.GetViews(currentPagination.value, sorting.value);
  }
</script>
<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:sorting="sorting"
    new
    :api-result="data"
    :on-load="onLoad"
    :table-map="tableMap"
    item-view-id="MkViewEdit"
  ></mk-table>
</template>
