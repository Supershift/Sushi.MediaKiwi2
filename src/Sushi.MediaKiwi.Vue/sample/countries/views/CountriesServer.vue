<script setup lang="ts">
  import { MkTable, MkTh } from "@/components";
  import { useI18next } from "@/composables";
  import { Paging, Sorting, SortDirection, TableFilter, TableFilterType, IPagingResult, IListResult } from "@/models";
  import { reactive, ref } from "vue";
  import AddCountry from "./AddCountry.vue";
  import { useSampleApi, Country } from "@sample/services";
  import { LoadDataEvent } from "@/models/table/TableProps";  

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
  const countries = ref<IListResult<Country>>();    
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
  async function LoadData(event: LoadDataEvent) {
    // gets all countries in 1 request
    const apiResponse = await sampleApi.countries({      
      countryCode: filters.value?.code?.selectedValue?.value,
      countryName: filters.value?.name?.selectedValue?.value,
      ...currentPagination.value,
      ...sorting.value,
    });    
    countries.value = apiResponse.data;
  }
  
  function openDialog() {
    state.addCountry = true;
  }
</script>
<template>
  <mk-table
    v-model:currentPagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    :api-result="countries"
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
