<script setup lang="ts">
  import { reactive, computed, ref } from "vue";
  import type { ITableMap, ITableFilter, ITableSortingValue } from "@supershift/mediakiwi-vue";
  import { TableFilterValueCollection, MkTable, MkTableFilterSelect, MkTableFilterTextField, MkTableFilterRadioGroup, MkTableFilterDatePicker, TableSortingDirection } from "@supershift/mediakiwi-vue";
  import SampleCustomTableFilterInput from "./SampleCustomTableFilterInput.vue";
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
    ],
  };

  // define filters for the data
  const filters = <ITableFilter>{
    items: [
      {
        id: "Name",
        title: "Naam",
        component: MkTableFilterTextField,
      },
      {
        id: "Country",
        title: "Land",
        options: [
          { title: "Nederland", value: "NL" },
          { title: "België", value: "BE" },
        ],
        component: MkTableFilterSelect,
      },
      {
        id: "FullName",
        title: "Volledige naam",
        component: SampleCustomTableFilterInput,
      },
      {
        id: "City",
        title: "Stad",
        options: [
          { title: "Rijswijk", value: "RSWK" },
          { title: "Delft", value: "DLFT" },
        ],
        component: MkTableFilterRadioGroup,
      },
      {
        id: "Date",
        title: "Dates",
        component: MkTableFilterDatePicker,
      },
    ],
  };

  // create an object which will hold selected filter values
  const selectedFilters = reactive(new TableFilterValueCollection());
  // create a sorting option object with a default value
  const selectedSortOption = ref<ITableSortingValue>({
    tableMapItemId: "lastSeen",
    sortDirection: TableSortingDirection.Desc,
  });

  // get the data, using the selected filters
  const sampleData = computed(() => {
    // get country filter
    let country = selectedFilters.get("Country")?.value;

    // get the data, using the sorting option
    let result = SampleDataService.GetAll(country, selectedSortOption.value);
    return result;
  });
</script>

<template>
  <MkTable v-model:selected-filters="selectedFilters" v-model:selected-sort-option="selectedSortOption" :filter-map="filters" :table-map="myMap" :data="sampleData" item-screen-name="SampleDataEdit">
  </MkTable>
</template>
