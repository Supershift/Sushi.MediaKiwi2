<script setup lang="ts">
  import { Country } from "../../models/Country";
  import { CountryConnector } from "../../services/CountryConnector";
  import { MkTable } from "@/components";
  import { useI18next } from "@/composables";
  import { ListResult, Paging, TableFilter, TableFilterType } from "@/models";
  import { container } from "tsyringe";
  import { reactive } from "vue";
  import { ref } from "vue";
  import AddCountry from "./AddCountry.vue";

  // inject dependencies
  const connector = container.resolve(CountryConnector);
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({ pageSize: 8 }); // demos 8 items per page (lower than default 10)
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

  // load data
  async function LoadData() {
    state.countries = await connector.GetAll(currentPagination.value, filters.value?.code?.selectedValue?.value, filters.value?.name?.selectedValue?.value);
  }

  function openDialog() {
    state.addCountry = true;
  }
</script>
<template>
  <mk-table
    v-model:currentPagination="currentPagination"
    v-model:filters="filters"
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
      <th>Code</th>
      <th>Name</th>
    </template>

    <template #tbody="{ dataItem }">
      <td>{{ dataItem.code }}</td>
      <td>{{ dataItem.name }}</td>
    </template>
  </mk-table>

  <AddCountry v-model="state.addCountry" />
</template>
