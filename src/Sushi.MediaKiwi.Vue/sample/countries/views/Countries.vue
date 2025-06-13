<script setup lang="ts">
  import { MkTable, MkTh } from "@/components";
  import { useI18next } from "@/composables";
  import { ListResult, Paging, Sorting, SortDirection, TableFilter, TableFilterType } from "@/models";
  import { reactive } from "vue";
  import { ref } from "vue";
  import AddCountry from "./AddCountry.vue";
  import { useSampleApi, Country } from "@sample/services";

  // inject dependencies
  const sampleApi = useSampleApi();
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({ pageSize: 11, pageIndex: 0 }); // demos 11 items per page (different from the default 10)
  const sorting = ref<Sorting>({
    sortBy: "name",
    sortDirection: SortDirection.Desc,
  });
  const state = reactive({
    countries: <ListResult<Country>>{},
    addCountry: false,
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
      selectedValue: {
        value: "bur",
      },
    },
  });

  const useClientSidePagination = true;

  // load data
  async function LoadData() {
    // gets all countries in 1 request when client side pagination is enabled
    const pagination = useClientSidePagination ? { pageSize: 9999, pageIndex: 0 } : currentPagination.value;

    state.countries = (
      await sampleApi.countries({
        ...pagination,
        countryCode: filters.value?.code?.selectedValue?.value,
        countryName: filters.value?.name?.selectedValue?.value,
      })
    ).data;
  }

  function openDialog() {
    state.addCountry = true;
  }
</script>
<template>
  <mk-table
    :client-side-pagination="useClientSidePagination"
    v-model:currentPagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    :api-result="state.countries"
    :data="state.countries?.result"
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
