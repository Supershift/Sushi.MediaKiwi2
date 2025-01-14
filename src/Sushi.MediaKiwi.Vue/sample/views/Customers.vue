<script setup lang="ts">
  import SampleSideSheet from "./../components/SampleSideSheet.vue";
  import { reactive, ref, watch, computed } from "vue";
  import { TableFilter, Sorting, Paging, TableFilterType, SortDirection, IconsLibrary, TableColumn, IListResult, DateRange, TableFilterValue } from "@/models";
  import { MkTable, MkOverflowMenuIcon, MkTd, MkTh } from "@/components";
  import type { SampleData } from "@sample/models/SampleData";
  import { SampleDataConnector } from "@sample/services/SampleDataConnector";
  import { ICustomer } from "./../models/Customer";
  import { useI18next, useFilterInQuery, useDatePresets } from "@/composables";
  import MkDatePresetMenu from "@/components/MkDatePresetMenu/MkDatePresetMenu.vue";

  // inject dependencies
  const sampleDataConnector = new SampleDataConnector();
  const { formatDate } = await useI18next();

  const dayPresets = [7, 28, 90, 365];
  const monthPresets = [0, 1];

  const { presets, formatPreset, formatDateRange } = await useDatePresets({
    dayPresets,
    monthPresets,
  });

  const currentYear = new Date().getFullYear();

  // define state
  const currentPagination = ref<Paging>({
    pageIndex: 0,
  });

  // create a sorting option object with a default value
  const sorting = ref<Sorting>({
    sortBy: "id",
    sortDirection: SortDirection.Desc,
  });

  const state = reactive({
    selectedTableRows: <SampleData[]>[],
    sampleData: <IListResult<SampleData>>{},
    refData: <ICustomer>{
      id: 1,
      name: "Jane Doe",
      countryCode: "NL",
      countryName: "Nederland",
      date: new Date("2021-01-01"),
    },
    selectedCustomerId: 0,
    showCustomerSideSheet: false,
    openPreselectMenu: <boolean>false,
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
      options: [
        { title: `Q1 ${currentYear}`, value: getQuarter("Q1") },
        { title: `Q2 ${currentYear}`, value: getQuarter("Q2") },
        { title: `Q3 ${currentYear}`, value: getQuarter("Q3") },
        { title: `Q4 ${currentYear}`, value: getQuarter("Q4") },
      ],
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
        { title: "Duitsland", value: "DE" },
        { title: "Amerika", value: "US" },
        { title: "Frankrijk", value: "FR" },
        { title: "Polen", value: "PL" },
      ],
      type: TableFilterType.MultiSelect,
    },
  });

  // setup date range filter
  const dateOptions = [...presets.value.days, ...presets.value.months].map((o) => {
    return { title: formatPreset([o.start, o.end]), value: [o.start, o.end] };
  });
  const dateRangeFilter = ref<TableFilter>({
    dateRange: {
      title: "",
      selectedValue: { title: dateOptions[1].title, value: dateOptions[1].value },
      options: dateOptions.map((o) => {
        return {
          title: o.title,
          value: o.value.map((a) => a.toISOString()), // needs to be iso so it can play nice with url values
        };
      }),
    },
  });

  // keep filters and query params in sync
  const allFilters = ref<TableFilter>({ ...filters.value, ...dateRangeFilter.value });
  useFilterInQuery(allFilters, currentPagination, sorting);

  // setup date range label and title
  const dataRangeLabel = computed<string>(() => {
    const dateRange = dateRangeFilter.value.dateRange.selectedValue!.value;
    return formatDateRange(dateRange[0], dateRange[1]);
  });
  if (!dateRangeFilter.value.dateRange.selectedValue!.title) {
    dateRangeFilter.value.dateRange.selectedValue!.title = dataRangeLabel.value;
  }

  function getQuarter(quarterTitle: string): DateRange {
    //if you are using current year
    const todayDate = new Date();

    let startMonth = todayDate.getMonth();
    let startDay = 1;

    let endMonth = todayDate.getMonth();
    let endDay = 0;

    switch (quarterTitle) {
      case "Q1":
        startMonth = 0;
        endMonth = 2;
        endDay = 31;
        break;
      case "Q2":
        startMonth = 3;
        endMonth = 5;
        endDay = 30;
        break;
      case "Q3":
        startMonth = 6;
        endMonth = 8;
        endDay = 30;
        break;
      case "Q4":
        startMonth = 9;
        endMonth = 11;
        endDay = 31;
        break;
    }

    todayDate.setMonth(startMonth);
    todayDate.setDate(startDay);
    const startDate = new Date(todayDate);

    todayDate.setMonth(endMonth);
    todayDate.setDate(endDay);
    const endDate = new Date(todayDate);

    return { start: startDate, end: endDate } as DateRange;
  }

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
    const result = await sampleDataConnector.GetAll(filters.value.country.selectedValue?.value, sorting.value);
    state.sampleData.result = result;
    // pagination and display options will only display when pageCount is not 0 !!!
    state.sampleData.pageCount = 1;
    state.sampleData.totalCount = result.length;

    // Add item as pre-selection
    if (state.sampleData?.result.length) {
      state.selectedTableRows = [state.sampleData.result[0]];
    }
  }

  function onCustomerClick(value: SampleData) {
    state.selectedCustomerId = value.id;
    state.showCustomerSideSheet = true;
  }

  // watch to close, othermethods not working
  watch(
    dateRangeFilter,
    () => {
      state.openPreselectMenu = false;
    },
    { deep: true }
  );
</script>

<template>
  <div class="d-flex flex-row text-start align-start on-surface">
    <div class="flex-column">
      <v-select
        v-model="dateRangeFilter.dateRange!.selectedValue"
        item-title="title"
        item-value="value"
        :label="dataRangeLabel"
        hide-details
        readonly
        :width="350"
        @click="state.openPreselectMenu = !state.openPreselectMenu"
      />
      <MkDatePresetMenu
        v-show="state.openPreselectMenu"
        v-model="dateRangeFilter.dateRange!.selectedValue!"
        elevation="3"
        item-title="title"
        item-value="value"
        :days="dayPresets"
        :months="monthPresets"
        hide-details
        date-picker-title="date range picker title"
      />
    </div>
  </div>

  <MkTable
    v-model:sorting="sorting"
    v-model:selection="state.selectedTableRows"
    v-model:filters="filters"
    v-model:current-pagination="currentPagination"
    :data="state.sampleData.result"
    :api-result="state.sampleData"
    :item-id="(item: ICustomer) => item.id"
    @load="LoadData"
    @click:row="onCustomerClick"
    hide-bulk-action-bar
    :disable-item-selection="(item) => item.id % 2 !== 0"
    display-options
    pagination-mode="controls"
  >
    <template #bulkActionBar="{ confirm }">
      <v-btn @click="confirm(download)"><v-icon :icon="IconsLibrary.trayArrowDown"></v-icon> Download</v-btn>
      <v-btn @click="confirm(move)">move</v-btn>

      <MkOverflowMenuIcon>
        <v-list-item @click="remove">Delete</v-list-item>
      </MkOverflowMenuIcon>
    </template>

    <template #thead>
      <mk-th v-model:sorting="sorting" sorting-key="id">Id</mk-th>
      <mk-th v-model:sorting="sorting" sorting-key="name">Name</mk-th>
      <mk-th v-model:sorting="sorting" sorting-key="countryName">Country of origin</mk-th>
      <mk-th v-model:sorting="sorting" sorting-key="date">Last seen</mk-th>
      <MkTh>Checked</MkTh>
    </template>

    <template #tbody="dataItem">
      <td>{{ dataItem.id }}</td>
      <td>{{ dataItem.name }}</td>
      <td>{{ dataItem.countryName }}</td>
      <td>{{ formatDate(dataItem.date) }}</td>
      <MkTd :value="true"></MkTd>
    </template>
  </MkTable>

  <SampleSideSheet :customer-id="state.selectedCustomerId" v-model="state.showCustomerSideSheet"></SampleSideSheet>
</template>
