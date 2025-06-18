<script setup lang="ts">
  import { MkTable, MkTh } from "@/components";
  import { useI18next, useTablePaging } from "@/composables";
  import { Paging, Sorting, SortDirection, TableFilter, TableFilterType, IPagingResult } from "@/models";
  import { reactive, ref, computed } from "vue";
  import AddCountry from "./AddCountry.vue";
  import { useSampleApi, Country } from "@sample/services";
  import { TableLoadDataEventType, TableLoadDataEvent } from "@/models/";
  import { sortArrayByKey } from "@/helpers";
  // inject dependencies
  const sampleApi = useSampleApi();
  const { t } = await useI18next();
  const { pageArray, calculatePaging } = useTablePaging();

  // define reactive variables
  const sorting = ref<Sorting<Country>>({
    sortBy: "name",
    sortDirection: SortDirection.Asc,
  });
  const state = reactive({
    countries: <Country[]>[],
    addCountry: false,
  });
  const paging = ref<IPagingResult>();
  const currentPagination = ref<Paging>({
    pageSize: 11,
    pageIndex: 0,
  });

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
    if (event.type == TableLoadDataEventType.InitialLoad || event.type == TableLoadDataEventType.FilterChange) {
      // gets all countries in 1 request
      const apiResponse = await sampleApi.countries({
        pageSize: 9999,
        pageIndex: 0,
        countryCode: filters.value?.code?.selectedValue?.value,
        countryName: filters.value?.name?.selectedValue?.value,
      });
      paging.value = calculatePaging(apiResponse.data.result, currentPagination.value);
      sortArrayByKey(apiResponse.data.result, sorting.value.sortBy, sorting.value.sortDirection);
      state.countries = apiResponse.data.result;
    }
    if (event.type == TableLoadDataEventType.SortChange) {
      sortArrayByKey(state.countries, sorting.value.sortBy, sorting.value.sortDirection);
    }
  }

  // get data to display in the table
  const getData = computed(() => {
    return pageArray(state.countries, currentPagination.value);
  });

  function openDialog() {
    state.addCountry = true;
  }
</script>
<template>
  <mk-table
    v-model:currentPagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    :data="getData"
    :paging="paging"
    @load="LoadData"
    :item-id="(item: Country) => item.code"
    navigation-item-id="CountryEdit"
    new
    :new-title="t('Add Country').toString()"
    new-emit
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
