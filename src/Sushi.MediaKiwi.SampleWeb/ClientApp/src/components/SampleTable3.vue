<script setup lang="ts">
  import { computed, ref } from "vue";
  import type { TableMap, TableFilter, Sorting } from "@supershift/mediakiwi-vue";
  import { MkTable, TableFilterType, SortDirection, IconPosition } from "@supershift/mediakiwi-vue";
  import type { ISampleData } from "./ISampleData";
  import { SampleDataService } from "./SampleDataService";

  // define a mapping between source data and desired columns in the table
  const myMap: TableMap<ISampleData> = {
    itemId: (item) => item.id,
    items: [
      { headerTitle: "Id", value: (dataItem) => dataItem.id, sortingOptions: { id: (x) => x.id } },
      { headerTitle: "Naam", value: (dataItem) => dataItem.name },
      { headerTitle: "Land", value: (dataItem) => dataItem.countryName, sortingOptions: { id: (x) => x.countryName } },
      { headerTitle: "Laast gezien", value: (dataItem) => dataItem.date?.toISOString() },
      {
        headerTitle: "Hulp",
        value: (dataItem) => dataItem.countryName,
        icon: (dataItem) => {
          return {
            value: dataItem.countryCode === "NL" ? "mdi-help-box" : "mdi-help-circle",
            tooltip: `Dynamische tooltip voor regel: ${dataItem.id} - ${dataItem.name} `,
            position: IconPosition.behind,
          };
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
      type: TableFilterType.Custom,
      component: () => import("./SampleCustomTableFilterInput.vue"),
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
      type: TableFilterType.DatePicker,
    },
  });

  // create a sorting option object with a default value
  const selectedSortOption = ref<Sorting>({
    sortBy: "id",
    sortDirection: SortDirection.Desc,
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
    v-model:sorting="selectedSortOption"
    v-model:selection="selectedTableRows"
    v-model:filters="filters"
    :table-map="myMap"
    :data="sampleData"
    checkbox
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
