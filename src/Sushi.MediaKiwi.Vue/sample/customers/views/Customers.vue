<script setup lang="ts">
  import CustomerDetailsSideSheet from "./partials/CustomerDetailsSideSheet.vue";
  import { reactive, ref, watch, computed } from "vue";
  import { TableFilter, Sorting, Paging, TableFilterType, SortDirection, IconsLibrary, IListResult, DateRange, TableFilterValue } from "@/models";
  import { MkTable, MkOverflowMenuIcon, MkTd, MkTh } from "@/components";
  import { CustomerConnector } from "@sample/customers/connectors/CustomerConnector";
  import { container } from "tsyringe";
  import { Customer } from "../models/Customer";
  import { useI18next, useFilterInQuery, useDatePresets, TableFilterItemQueryConverter } from "@/composables";
  import MkDatePresetMenu from "@/components/MkDatePresetMenu/MkDatePresetMenu.vue";
  import { DateTime } from "luxon";
  import { useValidationRules } from "@/composables";

  // inject dependencies
  const customerConnector = container.resolve(CustomerConnector);
  const { formatDate } = await useI18next();
  const { required } = await useValidationRules();

  const dayPresets = [1, 7, 28, 90, 365, -7, -14];
  const monthPresets = [0, 1, -1];

  const { presets, formatPreset, formatDateRange } = await useDatePresets({
    dayPresets,
    monthPresets,
  });

  const date = ref<DateTime>();

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
    selected: <Customer[]>[],
    customers: <IListResult<Customer>>{},
    refData: <Customer>{
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

  const currentYear = DateTime.now().year;
  const quarterOptions = [
    { title: `Q1 ${currentYear}`, value: getQuarter(1) },
    { title: `Q2 ${currentYear}`, value: getQuarter(2) },
    { title: `Q3 ${currentYear}`, value: getQuarter(3) },
    { title: `Q4 ${currentYear}`, value: getQuarter(4) },
  ];

  const countryFilterDisabled = ref<boolean>(false);
  function toggleCountryFilter() {
    countryFilterDisabled.value = !countryFilterDisabled.value;
  }

  const filters = ref<TableFilter>({
    name: {
      title: "Name",
      type: TableFilterType.TextField,
      searchable: true,
    },
    location: {
      title: "Location",
      children: {
        city: {
          title: "City",
          options: [
            { title: "Rijswijk", value: "RSWK" },
            { title: "Delft", value: "DLFT" },
          ],
          type: TableFilterType.SingleSelect,
        },
        regions: {
          title: "Regions",
          options: [
            { title: "Noord-Holland", value: "NH" },
            { title: "Zuid-Holland", value: "ZH" },
            { title: "Utrecht", value: "UT" },
            { title: "Limburg", value: "LB" },
            { title: "Overijssel", value: "OV" },
            { title: "Gelderland", value: "GE" },
            { title: "Flevoland", value: "FL" },
            { title: "Friesland", value: "FR" },
            { title: "Drenthe", value: "DR" },
          ],
          type: TableFilterType.MultiSelect,
        },
        country: {
          title: "Country",
          options: [
            { title: "Netherlands", value: "NL" },
            { title: "Belgium", value: "BE" },
            { title: "Germany", value: "DE" },
            { title: "France", value: "FR" },
            { title: "United Kingdom", value: "GB" },
          ],
          type: TableFilterType.SingleSelect,
          disabled: () => countryFilterDisabled.value,
          componentProps: {
            clearable: true,
            rules: [required],
          },
        },
      },
    },
    custom: {
      title: "Custom",
      type: TableFilterType.Custom,
      component: () => import("@sample/components/SampleCustomFilter.vue"),
    },
    dates: <TableFilterItemQueryConverter>{
      title: "Dates",
      type: TableFilterType.DateRange,
      options: quarterOptions,
      toUrl: (objectValue: TableFilterValue) => objectValue.value.map((v: DateTime) => v.toISO()),
      fromUrl: (urlValue: string | string[]) => {
        if (!Array.isArray(urlValue)) return undefined;
        const values = [DateTime.fromISO(urlValue[0]), DateTime.fromISO(urlValue[1])];
        const quarter = quarterOptions.find((q) => q.value.start.hasSame(values[0], "day") && q.value.end.hasSame(values[1], "day"));
        return { title: quarter ? quarter.title : formatPreset(values), value: values };
      },
    },
    date: <TableFilterItemQueryConverter>{
      title: "Date",
      type: TableFilterType.DatePicker,
      toUrl: (objectValue: TableFilterValue) => objectValue.value.toISO(),
      fromUrl: (urlValue: string | string[]) => ({ title: "", value: DateTime.fromISO(Array.isArray(urlValue) ? urlValue[0] : urlValue) }),
    },
  });
  useFilterInQuery(filters, currentPagination, sorting);

  const dateOptions = [...presets.value.daysExcludingToday, ...presets.value.months].map((o) => {
    return { title: formatPreset([o.start, o.end]), value: [o.start, o.end] };
  });

  const dateRange = ref<TableFilterValue>(dateOptions[0]);

  const dateRangeFilter = ref<TableFilter>({
    dateRange: <TableFilterItemQueryConverter>{
      title: "",
      options: dateOptions,
      toUrl: (objectValue: TableFilterValue) => objectValue.value.map((v: DateTime) => v.toISO()),
      fromUrl: (urlValue: string | string[]) => {
        if (!Array.isArray(urlValue)) return undefined;
        const values = [DateTime.fromISO(urlValue[0]), DateTime.fromISO(urlValue[1])];
        return { title: formatPreset(values), value: values };
      },
    },
  });
  useFilterInQuery(dateRangeFilter);

  const getFromUrl = () => {
    const range = dateRangeFilter.value.dateRange.selectedValue;
    if (!range) return;

    dateRange.value = { ...range, title: formatPreset([range.value[0], range.value[1]]) };
  };
  getFromUrl();

  const setToUrl = (nv: TableFilterValue) => (dateRangeFilter.value.dateRange.selectedValue = nv);
  watch(dateRange, setToUrl, { deep: true });

  const dataRangeLabel = computed<string>(() => {
    return formatDateRange(dateRange.value.value[0], dateRange.value.value[1]);
  });

  function getQuarter(quarterNumber: number): DateRange {
    let quarter = DateTime.fromFormat(quarterNumber.toString(), "q");
    return { start: quarter.startOf("quarter"), end: quarter.endOf("quarter") } as DateRange;
  }

  function download() {
    alert("Download: " + state.selected.length);
  }

  function remove() {
    console.log("Remove", state.selected);
  }

  function move() {
    alert("move: " + state.selected.length);
  }

  async function wait(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        LoadData().then(() => {
          resolve(undefined);
        });
      }, 2000);
    });
  }

  async function LoadData() {
    // get the data, using the sorting option
    const result = await customerConnector.GetAll(filters.value.location.children!.country.selectedValue?.value, sorting.value);
    state.customers.result = result;
    // pagination and display options will only display when pageCount is not 0 !!!
    state.customers.pageCount = 1;
    state.customers.totalCount = result.length;

    // Add item as pre-selection
    if (state.customers?.result.length) {
      state.selected = [state.customers.result[0]];
    }
  }

  function onCustomerClick(value: Customer) {
    state.selectedCustomerId = value.id;
    state.showCustomerSideSheet = true;
  }

  // watch to close, othermethods not working
  watch(dateRange, () => (state.openPreselectMenu = false), { deep: true });
</script>

<template>
  <div class="d-flex flex-row text-start align-start on-surface ga-2 align-center mb-4">
    <div class="flex-column">
      <v-menu :close-on-content-click="false" location-strategy="connected" location="bottom">
        <template #activator="{ props }">
          <v-select
            v-bind="props"
            v-model="dateRange"
            item-title="title"
            item-value="value"
            :label="dataRangeLabel"
            hide-details
            readonly
            :width="350"
            @click="state.openPreselectMenu = !state.openPreselectMenu"
          />
        </template>
        <MkDatePresetMenu
          v-model="dateRange"
          @update:model-value="state.openPreselectMenu = !state.openPreselectMenu"
          elevation="3"
          item-title="title"
          item-value="value"
          :days="dayPresets"
          :months="monthPresets"
          include-today
          hide-details
        />
      </v-menu>
    </div>
    <v-btn @click="toggleCountryFilter">Toggle country filter</v-btn>        
  </div>

  <MkTable
    v-model:sorting="sorting"
    v-model:selection="state.selected"
    v-model:filters="filters"
    v-model:current-pagination="currentPagination"
    :data="state.customers.result"
    :api-result="state.customers"
    :item-id="(item: Customer) => item.id"
    @load="wait"
    @click:row="onCustomerClick"
    hide-bulk-action-bar
    :disable-item-selection="(item) => item.id % 2 !== 0"
    display-options
    pagination-mode="controls"
    hide-selected-row
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

    <template #tbody="{ dataItem }">
      <td>{{ dataItem.id }}</td>
      <td>{{ dataItem.name }}</td>
      <td>{{ dataItem.countryName }}</td>
      <td>{{ formatDate(dataItem.date) }}</td>
      <MkTd :value="true"></MkTd>
    </template>
  </MkTable>

  <CustomerDetailsSideSheet :customer-id="state.selectedCustomerId" v-model="state.showCustomerSideSheet"></CustomerDetailsSideSheet>
</template>
