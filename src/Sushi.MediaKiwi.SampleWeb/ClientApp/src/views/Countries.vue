<script setup lang="ts">
  import { Country } from "@/models/Country";
  import { CountryConnector } from "@/services/CountryConnector";
  import { ListResult, MkTable, TableMap } from "@supershift/mediakiwi-vue";
  import type { Paging } from "@supershift/mediakiwi-vue";
  import { container } from "tsyringe";
  import { ref } from "vue";

  // inject dependencies
  const connector = container.resolve(CountryConnector);

  // define reactive variables
  const currentPagination = ref<Paging>({});
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
    countries.value = await connector.GetAll(currentPagination.value);
  }
</script>
<template>
  <mk-table
    v-model:currentPagination="currentPagination"
    :api-result="countries"
    :table-map="tableMap"
    :on-load="LoadData"
    pagination-mode="intersect"
  ></mk-table>
</template>
