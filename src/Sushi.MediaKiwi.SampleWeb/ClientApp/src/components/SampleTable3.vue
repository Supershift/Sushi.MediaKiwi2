<script setup lang="ts">
  import { computed, ref } from "vue";
  import type { ITableMap, TableFilter, ITableSortingValue } from "@supershift/mediakiwi-vue";
  import { MkTable, TableFilterType, TableSortingDirection } from "@supershift/mediakiwi-vue";
  import type { ISampleData } from "./ISampleData";
  import { SampleDataService } from "./SampleDataService";
  import { IconPosition } from "@supershift/mediakiwi-vue";

  // define a mapping between source data and desired columns in the table
  const myMap = <ITableMap<ISampleData>>{
    itemId: (item) => {
      return item.id;
    },
    items: [
      { id: "id", headerTitle: "Id", value: (dataItem) => dataItem.id, sortingOptions: { defaultSortDirection: TableSortingDirection.Desc } },
      { headerTitle: "Naam", value: (dataItem) => dataItem.name },
      { id: "country", headerTitle: "Land", value: (dataItem) => dataItem.countryName, sortingOptions: { defaultSortDirection: TableSortingDirection.Asc } },
      { id: "lastSeen", headerTitle: "Laast gezien", value: (dataItem) => dataItem.date?.toISOString(), sortingOptions: { defaultSortDirection: TableSortingDirection.Desc } },
      {
        headerTitle: "Hulp",
        value: (dataItem) => dataItem.countryName,
        // icon: "mdi-help-box", // Option 1
        // icon: (dataItem) => (dataItem.countryCode === "NL" ? "mdi-help-box" : "mdi-help-circle"),  // Option 2
        // icon: {
        //   // Option 3
        //   value: "mdi-help-box",
        //   tooltip: `Dit is een fixed tooltip`,
        //   position: IconPosition.behind,
        // },
        icon: {
          // Option 4
          value: (dataItem) => (dataItem.countryCode === "NL" ? "mdi-help-box" : "mdi-help-circle"),
          tooltip: (dataItem) => `Dynamische tooltip voor regel: ${dataItem.id} - ${dataItem.name} `,
          position: IconPosition.behind,
        },
      },
      {
        headerTitle: "Checked",
        value: () => true, // MediaKiwi will render a mdi check icon if the value returns a boolean
      },
    ],
  };

  // define filters
  const filters = ref<TableFilter>({
    name: {
      title: "Name",
      options: [],
      type: TableFilterType.TextField,
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
      options: [],
      type: TableFilterType.TextField,
    },
    city: {
      title: "Stad",
      options: [
        { title: "Rijswijk", value: "RSWK" },
        { title: "Delft", value: "DLFT" },
      ],
      type: TableFilterType.RadioGroup,
    },
    date: {
      title: "Dates",
      options: [],
      type: TableFilterType.DatePicker,
    },
  });

  // create a sorting option object with a default value
  const selectedSortOption = ref<ITableSortingValue>({
    tableMapItemId: "lastSeen",
    sortDirection: TableSortingDirection.Desc,
  });
  // create a ref collection of selected table rows
  const selectedTableRows = ref([]);

  // get the data, using the selected filters
  const sampleData = computed(() => {
    // get country filter
    let country = filters.value.country.selectedValue?.value;

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
  <MkTable
    v-model:selected-sort-option="selectedSortOption"
    v-model:selection="selectedTableRows"
    v-model:filters="filters"
    :table-map="myMap"
    :data="sampleData"
    :show-select="true"
    item-view-id="SampleEdit"
  >
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
