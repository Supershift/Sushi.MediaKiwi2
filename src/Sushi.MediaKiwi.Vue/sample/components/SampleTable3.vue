<script setup lang="ts">
  import { computed, ref } from "vue";
  import type { TableMap, TableFilter, Sorting, Paging } from "@/framework";
  import { MkTable, TableFilterType, SortDirection, IconsLibrary, MkOverflowMenuIcon } from "@/framework";
  import type { ISampleData } from "./ISampleData";
  import { SampleDataService } from "./SampleDataService";

  // define a mapping between source data and desired columns in the table
  const myMap: TableMap<ISampleData> = {
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
    alert("Download: " + selectedTableRows.value.length);
  }

  function remove() {
    console.log("Remove", selectedTableRows.value);
  }

  function move() {
    alert("move: " + selectedTableRows.value.length);
  }
  defineEmits(["clicked:customer"]);
</script>

<template>
  <MkTable
    v-model:sorting="selectedSortOption"
    v-model:selection="selectedTableRows"
    v-model:filters="filters"
    v-model:current-pagination="currentPagination"
    :table-map="myMap"
    :data="sampleData"
    checkbox
    title="Customer collection"
    @click:row="$emit('clicked:customer', $event)"
  >
    <template #bulkActionBar="{ confirm }">
      <v-btn @click="confirm(download)"><v-icon :icon="IconsLibrary.trayArrowDown"></v-icon> Download</v-btn>
      <v-btn @click="confirm(move)">move</v-btn>

      <MkOverflowMenuIcon>
        <v-list-item @click="remove">Delete</v-list-item>
      </MkOverflowMenuIcon>
    </template>
  </MkTable>
</template>
