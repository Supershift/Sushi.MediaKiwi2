<script setup lang="ts">
  import { MkTable, MkTh } from "@/components";
  import { useI18next } from "@/composables";
  import { Sorting, SortDirection, TableFilter, TableFilterType, TableSortingMode, TablePagingMode, TableLoadDataEvent } from "@/models";
  import { reactive, ref } from "vue";
  import AddCountry from "./AddCountry.vue";
  import { useSampleApi, Country } from "@sample/services";

  // inject dependencies
  const sampleApi = useSampleApi();
  const { t } = await useI18next();

  // define reactive variables
  const sorting = ref<Sorting<Country>>({
    sortBy: "name",
    sortDirection: SortDirection.Asc,
  });
  const state = reactive({
    addCountry: false,
  });

  const countries = ref<Country[]>([]);

  // define filters
  const filters = ref<TableFilter>({
    code: {
      title: "Code",
      type: TableFilterType.TextField,
    },
    name: {
      title: "Name",
      type: TableFilterType.TextField,
    },
  });

  // load data from source
  async function LoadData(event: TableLoadDataEvent) {
    // gets all countries in 1 request
    const apiResponse = await sampleApi.countries({
      pageSize: 9999,
      pageIndex: 0,
      countryCode: filters.value?.code?.selectedValue?.value,
      countryName: filters.value?.name?.selectedValue?.value,
    });

    countries.value = apiResponse.data.result;
  }

  function openDialog() {
    state.addCountry = true;
  }
</script>
<template>
  <mk-table
    v-model:filters="filters"
    v-model:sorting="sorting"
    :data="countries"
    :paging-mode="TablePagingMode.Auto"
    :sorting-mode="TableSortingMode.Auto"
    @load="LoadData"
    :item-id="(item: Country) => item.code"
    page-tracking
    @click:new="openDialog"
  >
    <template #thead>
      <mk-th v-model:sorting="sorting" :sorting-options="{ id: 'code' }">{{ t("Code") }}</mk-th>
      <mk-th v-model:sorting="sorting" :sorting-options="{ id: 'name' }">{{ t("Name") }}</mk-th>
    </template>

    <template #tbody="{ dataItem }">
      <td>{{ dataItem.code }}</td>
      <td>{{ dataItem.name }}</td>
    </template>
  </mk-table>

  <AddCountry v-model="state.addCountry" />
</template>
