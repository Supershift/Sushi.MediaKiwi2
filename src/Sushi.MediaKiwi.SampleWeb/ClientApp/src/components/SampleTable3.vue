<script setup lang="ts">
  import { computed, defineAsyncComponent, ref } from "vue";
  import { ITableMap, TableFilter, ITableSortingValue, TableFilterType } from "@supershift/mediakiwi-vue";
  import { MkTable, TableSortingDirection } from "@supershift/mediakiwi-vue";
  import type { ISampleData } from "./ISampleData";
  import { SampleDataService } from "./SampleDataService";

  // define a mapping between source data and desired columns in the table
  const myMap = <ITableMap<ISampleData>>{
    itemId: (item) => {
      return item.id;
    },
    showSelect: true,
    items: [
      { id: "id", headerTitle: "Id", value: (dataItem) => dataItem.id, sortingOptions: { defaultSortDirection: TableSortingDirection.Desc } },
      { id: "name", headerTitle: "Naam", value: (dataItem) => dataItem.name },
      { id: "country", headerTitle: "Land", value: (dataItem) => dataItem.countryName, sortingOptions: { defaultSortDirection: TableSortingDirection.Asc } },
      { id: "lastSeen", headerTitle: "Laast gezien", value: (dataItem) => dataItem.date?.toISOString(), sortingOptions: { defaultSortDirection: TableSortingDirection.Desc } },
      {
        id: "help",
        headerTitle: "Hulp",
        value: (dataItem) => dataItem.countryName,
        iconOptions: {
          value: (dataItem) => (dataItem.countryCode === "NL" ? "mdi-help-box" : "mdi-help-circle"),
          tooltip: (dataItem) => `Hulp met ${dataItem.countryName}`,
        },
      },
      {
        id: "check",
        headerTitle: "Checked",
        value: () => true,
      },
    ],
  };

  // define filters for the data
  const filters = ref<TableFilter>({
    Name: {
      title: "Naam",
      type: TableFilterType.TextField,
    },
    Country: {
      title: "Land",
      options: [
        { title: "Nederland", value: "NL" },
        { title: "België", value: "BE" },
      ],
      type: TableFilterType.Select,
    },
    FullName: {
      title: "Volledige naam",
      type: TableFilterType.Custom,
      component: () => import("./SampleCustomTableFilterInput.vue"),
    },
    City: {
      title: "Stad",
      options: [
        { title: "Rijswijk", value: "RSWK" },
        { title: "Delft", value: "DLFT" },
      ],
      type: TableFilterType.RadioGroup,
    },
    Date: {
      title: "Dates",
      type: TableFilterType.DatePicker,
    },
  });

  // create a sorting option object with a default value
  const selectedSortOption = ref<ITableSortingValue>({
    tableMapItemId: "lastSeen",
    sortDirection: TableSortingDirection.Desc,
  });
  // create a ref collection of selected table rows
  const selectedTableRows = ref<number[]>([]);

  // get the data, using the selected filters
  const sampleData = computed(() => {
    // get country filter
    let country = filters.value.Country.selectedValue?.value;

    // get the data, using the sorting option
    let result = SampleDataService.GetAll(country, selectedSortOption.value);
    return result;
  });

  function download() {
    console.log("Download", selectedTableRows.value);
  }

  function remove() {
    console.log("Remove", selectedTableRows.value);
  }

  function move() {
    console.log("move", selectedTableRows.value);
  }
</script>

<template>
  <MkTable v-model:filters="filters" v-model:selected-sort-option="selectedSortOption" v-model:selected-table-rows="selectedTableRows" :table-map="myMap" :data="sampleData" item-view-id="SampleEdit">
    <template #actions>
      <v-btn @click="download">Download</v-btn>
      <v-btn @click="move">move</v-btn>

      <v-btn icon color="primary">
        <v-icon>mdi-dots-vertical</v-icon>

        <v-menu activator="parent">
          <v-list>
            <v-list-item>
              <v-list-item-title @click="remove">Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </template>
  </MkTable>
</template>
