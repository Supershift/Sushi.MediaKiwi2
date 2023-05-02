<script setup lang="ts">
  import { Country } from "@/models/Country";
  import { CountryConnector } from "@/services/CountryConnector";
  import { ListResult, MkTable, TableMap } from "@supershift/mediakiwi-vue";
  import { container } from "tsyringe";
  import { ref } from "vue";

  // inject dependencies
  const connector = container.resolve(CountryConnector);

  // define reactive variables
  const currentPage = ref(0);
  const countries = ref<ListResult<Country>>();

  // define mapping
  const tableMap: TableMap<Country> = {
    itemId: (x) => x.code,
    items: [
      { headerTitle: "Code", value: (x) => x.code },
      { headerTitle: "Name", value: (x) => x.name },
    ],
  };

  // load data
  async function LoadData() {
    countries.value = await connector.GetAll({ pageIndex: currentPage.value });
  }
</script>
<template>
  <mk-table :api-result="countries" :table-map="tableMap" :on-load="LoadData" v-model:current-page="currentPage"></mk-table>
</template>
