<script setup lang="ts">
  import { TableMap, Locale, ListResult } from "@/models";
  import { useI18next } from "@/composables";
  import { container } from "tsyringe";
  import { ILocaleConnector } from "@/services";
  import { ref } from "vue";
  import { MkTable } from "@/components";
  // inject dependencies
  const localeConnector = container.resolve<ILocaleConnector>("ILocaleConnector");
  const { t, defaultT } = await useI18next();

  // define reactive variables
  const data = ref<ListResult<Locale>>();
  const currentPage = ref(0);

  // define mapping
  const tableMap: TableMap<Locale> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Id", value: (x) => x.id },
      { headerTitle: defaultT.value("Name"), value: (x) => x.name },
      { headerTitle: defaultT.value("IsEnabled"), value: (x) => x.isEnabled },
    ],
  };

  // get data
  async function onLoad() {
    data.value = await localeConnector.GetAll(false, { pageIndex: currentPage.value, pageSize: 10 });
  }
</script>
<template>
  <mk-table :table-map="tableMap" v-model:current-page="currentPage" new :api-result="data" :on-load="onLoad" item-view-id="MkLocaleEdit"></mk-table>
</template>
