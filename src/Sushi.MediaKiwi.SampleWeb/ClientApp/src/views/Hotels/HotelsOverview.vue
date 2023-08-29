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
      { headerTitle: t.value("Name"), value: (item) => item.name },
      { headerTitle: t.value("Created"), value: (item) => formatDateTime.value(item.created) },
      { headerTitle: t.value("Country"), value: (item) => countries.value!.find((x) => x.code == item.countryCode)?.name },
      { headerTitle: t.value("Active"), value: (item) => item.isActive },
      { headerTitle: t.value("SRP"), value: (item) => item.srp },
      { headerTitle: "", value: (item) => srpIcon(item) },
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

  // Load countries
  countries.value = (await countriesConnector.GetAll({ pageIndex: 0, pageSize: 9999 })).result;

  // Set filter options
  filters.value.countryCode.options = countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code });

  function action() {
    //
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
  >
    <template #actions>
      <v-btn>Knop 1</v-btn>
      <v-btn>Knop 2</v-btn>
    </template>
    <template #menuActions>
      <v-list>
        <v-list-item title="Action 1" @click="action" />
        <v-list-item title="Action 2" @click="action" />
        <v-list-item title="Action 3" @click="action" />
        <v-list-item title="Action 4" @click="action" />
      </v-list>
    </template>
  </mk-table>
</template>
