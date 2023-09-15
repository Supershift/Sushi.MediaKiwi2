<script setup lang="ts">
  import { Country } from "@/models/Country";
  import { Hotel } from "@/models/Hotel";
  import { CountryConnector } from "@/services/CountryConnector";
  import { HotelConnector } from "@/services/HotelConnector";
  import { IconsLibrary, Paging } from "@supershift/mediakiwi-vue";

  import {
    ListResult,
    MkTable,
    TableCellIcon,
    TableIconPosition,
    TableFilter,
    TableFilterType,
    TableFilterValue,
    TableMap,
    useI18next,
    MkCheckbox,
    MkAutocomplete,
  } from "@supershift/mediakiwi-vue";

  import { container } from "tsyringe";
  import { ref } from "vue";

  // inject dependencies
  const connector = container.resolve(HotelConnector);
  const countriesConnector = container.resolve(CountryConnector);
  const { formatDateTime, t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const hotels = ref<ListResult<Hotel>>();
  const countries = ref<Country[]>();

  // Load countries
  countries.value = (await countriesConnector.GetAll({ pageIndex: 0, pageSize: 9999 })).result;

  // define mapping
  function srpIcon(item: Hotel): TableCellIcon {
    return {
      position: item.srp ? TableIconPosition.Append : TableIconPosition.Prepend,
      iconName: item.srp ? "$accountCheckOutline" : IconsLibrary.accountCircle,
      tooltip: item.srp ? "SRP" : "NoSRP",
      label: item.srp ? "SRP correct" : "Define SRP",
    };
  }
  const tableMap: TableMap<Hotel> = {
    itemId: (item) => item.id,
    items: [
      { headerTitle: t.value("Name"), value: (item: Hotel) => item.name },
      { headerTitle: t.value("Created"), value: (item: Hotel) => formatDateTime.value(item.created) },
      {
        headerTitle: t.value("Country"),
        value: (item: Hotel) => countries.value!.find((x) => x.code == item.countryCode)?.code,
        editOptions: {
          property: "countryCode",
          component: MkAutocomplete,
          componentProps: {
            options: countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code }),
          },
        },
      },
      {
        headerTitle: t.value("Active"),
        value: (item: Hotel) => item.isActive,
        editOptions: {
          property: "isActive",
          component: MkCheckbox,
        },
      },
      { headerTitle: t.value("SRP"), value: (item: Hotel) => item.srp },
      { headerTitle: "", value: (item: Hotel) => srpIcon(item) },
    ],
  };

  // define filters
  const filters = ref<TableFilter>({
    isActive: {
      title: "Active",
      type: TableFilterType.RadioGroup,
      options: [
        { title: "Yes", value: true },
        { title: "No", value: false },
      ],
    },
    countryCode: {
      title: "Country",
      type: TableFilterType.Select,
      options: [],
    },
  });

  // load data
  async function LoadData() {
    hotels.value = await connector.GetAllAsync(
      currentPagination.value,
      filters.value.countryCode.selectedValue?.value,
      filters.value.isActive.selectedValue?.value
    );
  }

  // Set filter options
  filters.value.countryCode.options = countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code });

  function action() {
    //
  }

  async function onUpdateDataItem(newValue: Hotel) {
    // Update existing hotel
    // TODO Implement feedback
    await connector.SaveAsync(newValue);
  }
</script>

<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:filters="filters"
    new
    :api-result="hotels"
    :table-map="tableMap"
    :on-load="LoadData"
    :data="hotels?.result"
    item-view-id="HotelEdit"
    title="Subtitle for the hotel list"
    @update:data-item="onUpdateDataItem"
  >
    <template #toolbar>
      <v-btn>Knop 1</v-btn>
      <v-btn>Knop 2</v-btn>
    </template>

    <template #overflowMenuActions>
      <v-list-item @click="action">Knop 3</v-list-item>
    </template>
  </mk-table>
</template>
