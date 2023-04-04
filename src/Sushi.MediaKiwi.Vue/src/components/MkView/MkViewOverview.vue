<script setup lang="ts">
  import { MkTable } from "../MkTable";
  import { ITableMap, ITableMapItem } from "@/models";
  import { View } from "@/models";
  import { useMediakiwiStore } from "@/stores";
  import { reactive } from "vue";
  import { storeToRefs } from "pinia";
  import { container } from "tsyringe";
  import { IViewConnector } from "@/services";
  // inject dependencies
  const viewConnector = container.resolve<IViewConnector>("IViewConnector");
  const store = useMediakiwiStore();

  // get data
  const { sections } = storeToRefs(store);
  const viewsResult = await viewConnector.GetViews();
  const views = reactive(viewsResult.result);

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
</script>
<template>
  <mk-table :data="views" :table-map="tableMap" item-view-id="ViewEdit"></mk-table>
</template>
