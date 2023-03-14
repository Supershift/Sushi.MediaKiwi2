<script setup lang="ts">
  import { reactive, computed, ref } from "vue";
  import { MkTable } from "@supershift/mediakiwi-vue";
  import type { ITableMap, ITableFilter, ITableSortingValue } from "@supershift/mediakiwi-vue";
  import { TableFilterValueCollection } from "@supershift/mediakiwi-vue";
  import { MkTableFilterTextField } from "@supershift/mediakiwi-vue";
  import { MkTableFilterSelect } from "@supershift/mediakiwi-vue";
  import SampleCustomTableFilterInput from "./SampleCustomTableFilterInput.vue";
  import type { ISampleData } from "./ISampleData";
  import { SampleDataService } from "./SampleDataService";

  // define a mapping between source data and desired columns in the table
  const myMap = <ITableMap<ISampleData>>{
    itemId: (item) => {
      return item.id;
    },
    items: [
      { id: "name", headerTitle: "Naam", value: (dataItem) => dataItem.name, isSortable: true },
      { id: "countryName", headerTitle: "Land", value: (dataItem) => dataItem.countryName, isSortable: true },
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
    ],
  };

  // create an object which will hold selected filter values
  const selectedFilters = reactive(new TableFilterValueCollection());
  const selectedSortOption = ref<ITableSortingValue>();

  // get the data, using the selected filters
  const sampleData = computed(() => {
    // get country filter
    let country = selectedFilters.get("Country")?.value;

    // get the data
    let result = SampleDataService.GetAll(country, selectedSortOption.value);
    return result;
  });
</script>

<template>
  <MkTable :filter-map="filters" v-model:selected-filters="selectedFilters" v-model:selected-sort-option="selectedSortOption" :table-map="myMap" :data="sampleData" item-screen-name="SampleDataEdit">
  </MkTable>
</template>
