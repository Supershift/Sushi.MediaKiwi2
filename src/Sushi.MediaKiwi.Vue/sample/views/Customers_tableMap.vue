<script setup lang="ts">
  import SampleSideSheet from "./../components/SampleSideSheet.vue";
  import { reactive, ref } from "vue";
  import { TableMap, TableFilter, Sorting, Paging, TableFilterType, SortDirection, IconsLibrary } from "@/models";
  import { MkTable, MkOverflowMenuIcon } from "@/components";
  import type { SampleData } from "@sample/models/SampleData";
  import { SampleDataConnector } from "@sample/services/SampleDataConnector";
  import { container } from "tsyringe";
  import { ICustomer } from "./../models/Customer";

  // inject dependencies
  const sampleDataConnector = container.resolve(SampleDataConnector);

  // define a mapping between source data and desired columns in the table
  const myMap: TableMap<SampleData> = {
    itemId: (item) => item.id,
    items: [
      { headerTitle: "Id", value: (dataItem) => dataItem.id, sortingOptions: { id: (x) => x.id } },
      { headerTitle: "Name", value: (dataItem) => dataItem.name, sortingOptions: { id: (x) => x.name } },
      { headerTitle: "Country of origin", value: (dataItem) => dataItem.countryName, sortingOptions: { id: (x) => x.countryName } },
      {
        headerTitle: "Last seen",
        value: (dataItem) => dataItem.date?.toISOString(),
        sortingOptions: { id: (x) => x.date },
      },
      {
        headerTitle: "Checked",
        value: () => true, // MediaKiwi will render a mdi check icon if the value returns a boolean
      },
    ],
  };

  const currentPagination = ref<Paging>({});

  const state = reactive({
    selectedSortOption: {
      sortBy: "id",
      sortDirection: SortDirection.Desc,
    },
    selectedTableRows: [],
    sampleData: <SampleData[]>[],
    refData: <ICustomer>{
      id: 1,
      name: "Jane Doe",
      countryCode: "NL",
      countryName: "Nederland",
      date: new Date("2021-01-01"),
    },
  });

  // define filters
  const filters = ref<TableFilter>({
    name: {
      title: "Name",
      type: TableFilterType.TextField,
      searchable: true,
    },
    country: {
      title: "Land",
      options: [
        { title: "Nederland", value: "NL" },
        { title: "België", value: "BE" },
      ],
      type: TableFilterType.Select,
    },
    fullName: {
      title: "Volledige naam",
      type: TableFilterType.Custom,
      component: () => import("@sample/components/SampleCustomTableFilterInput.vue"),
    },
    city: {
      title: "Stad",
      options: [
        { title: "Rijswijk", value: "RSWK" },
        { title: "Delft", value: "DLFT" },
      ],
      type: TableFilterType.RadioGroup,
    },
    dates: {
      title: "Dates",
      type: TableFilterType.DateRange,
    },
    date: {
      title: "Date",
      type: TableFilterType.DatePicker,
    },
    countries: {
      title: "Landen",
      options: [
        { title: "Nederland", value: "NL" },
        { title: "België", value: "BE" },
      ],
      type: TableFilterType.SelectMultipleCheckbox,
    },
  });

  function download() {
    alert("Download: " + state.selectedTableRows.length);
  }

  function remove() {
    console.log("Remove", state.selectedTableRows);
  }

  function move() {
    alert("move: " + state.selectedTableRows.length);
  }

  async function LoadData() {
    // get the data, using the sorting option
    const result = await sampleDataConnector.GetAll(filters.value.country.selectedValue?.value, state.selectedSortOption);
    state.sampleData = result;
  }

  function onCustomerClick(value: any) {
    state.refData = value;
  }
</script>

<template>
  <MkTable
    v-model:sorting="state.selectedSortOption"
    v-model:selection="state.selectedTableRows"
    v-model:filters="filters"
    v-model:current-pagination="currentPagination"
    :table-map="myMap"
    @load="LoadData"
    :data="state.sampleData"
    checkbox
    title="Customer collection"
    @click:row="onCustomerClick"
  >
    <template #bulkActionBar="{ confirm }: any">
      <v-btn @click="confirm(download)"><v-icon :icon="IconsLibrary.trayArrowDown"></v-icon> Download</v-btn>
      <v-btn @click="confirm(move)">move</v-btn>

      <MkOverflowMenuIcon>
        <v-list-item @click="remove">Delete</v-list-item>
      </MkOverflowMenuIcon>
    </template>
  </MkTable>
</template>
