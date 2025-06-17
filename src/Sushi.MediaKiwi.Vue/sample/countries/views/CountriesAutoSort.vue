<script setup lang="ts">
  import { MkTable, MkTh } from "@/components";
  import { useI18next, useTablePaging } from "@/composables";
  import { Paging, Sorting, SortDirection, TableFilter, TableFilterType, IPagingResult } from "@/models";
  import { reactive, ref, computed } from "vue";
  import AddCountry from "./AddCountry.vue";
  import { useSampleApi, Country } from "@sample/services";
  import { LoadDataEvent, LoadDataEventType, MkTablePagingSource } from "@/models/table/TableProps";
  import { useTableSorting } from "@/composables";

  // inject dependencies
  const sampleApi = useSampleApi();
  const { t } = await useI18next();
  const { sortArray } = useTableSorting();

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
  async function LoadData(event: LoadDataEvent) {
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
    :paging-source="MkTablePagingSource.Auto"
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
