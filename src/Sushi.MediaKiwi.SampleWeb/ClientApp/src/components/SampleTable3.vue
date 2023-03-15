<script setup lang="ts">
  import { reactive, computed } from "vue";
  import type { ITableMap, ITableFilter, ITableFilterItem } from "@supershift/mediakiwi-vue";
  import { TableFilterValueCollection, MkTable, MkTableFilterSelect, MkTableFilterTextField, MkTableFilterRadioGroup, MkTableFilterDatePicker } from "@supershift/mediakiwi-vue";
  import SampleCustomTableFilterInput from "./SampleCustomTableFilterInput.vue";
  import type { ISampleData } from "./ISampleData";
  import { SampleDataService } from "./SampleDataService";

  // define a mapping between source data and desired columns in the table
  const myMap = <ITableMap<ISampleData>>{
    itemId: (item) => {
      return item.id;
    },
    items: [
      { headerTitle: "Naam", value: (dataItem) => dataItem.name },
      { headerTitle: "Land", value: (dataItem) => dataItem.countryName },
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

  // get the data, using the selected filters
  const sampleData = computed(() => {
    // get country filter
    let country = selectedFilters.get("Country")?.value;
    // get the data
    let result = SampleDataService.GetAll(country);
    return result;
  });
</script>

<template>
  <MkTable :filter-map="filters" v-model:selected-filters="selectedFilters" :table-map="myMap" :data="sampleData" item-screen-name="SampleDataEdit"> </MkTable>
</template>
