<script setup lang="ts">
  import { Country } from "./../../models/Country";
  import { Hotel } from "./../../models/Hotel";
  import { CountryConnector } from "./../../services/CountryConnector";
  import { HotelConnector } from "./../../services/HotelConnector";
  import {
    IconsLibrary,
    Paging,
    ListResult,
    Sorting,
    SortDirection,
    TableCellIcon,
    TableIconPosition,
    TableFilter,
    TableFilterType,
    TableFilterValue,
  } from "@/models";

  import { MkTable, MkTh, MkTd } from "@/components";
  import { useI18next } from "@/composables";

  import { container } from "tsyringe";
  import { ref } from "vue";
  import { TableColumn } from "@/models/table/TableColumn";

  // inject dependencies
  const connector = container.resolve(HotelConnector);
  const countriesConnector = container.resolve(CountryConnector);
  const { formatDateTime, t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({
    pageIndex: 0,
    pageSize: 11,
  }); // demos 11 items per page (higher than default 10), also adds to the current list
  const hotels = ref<ListResult<Hotel>>();
  const countries = ref<Country[]>();
  const displayOptions = ref<TableColumn[]>();
  const selectedHotels = ref<Hotel[]>([]);

  // define mapping
  function srpIcon(item: Hotel): TableCellIcon {
    return {
      position: item.srp ? TableIconPosition.Append : TableIconPosition.Prepend,
      iconName: item.srp ? IconsLibrary.checkCircleOutline : IconsLibrary.accountCircle,
      tooltip: item.srp ? "SRP" : "NoSRP",
      label: item.srp ? "SRP correct" : "Define SRP",
    };
  }

  // define filters
  const filters = ref<TableFilter>({
    isActive: {
      title: "Active",
      type: TableFilterType.RadioGroup,
      options: [
        { title: "Yes", value: true },
        { title: "No", value: false },
      ],
      closable: false,
      selectedValue: { title: "Yes", value: true },
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
  const countryOptions = countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code });

  // create a sorting option object with a default value
  const sorting = ref<Sorting>({
    sortBy: "name",
    sortDirection: SortDirection.Desc,
  });

  async function onNameChanged(hotel: Hotel, name: string) {
    hotel.name = name;
    await SaveData(hotel);
  }

  async function onCountryCodeChanged(hotel: Hotel, code: string) {
    hotel.countryCode = code;
    await SaveData(hotel);
  }

  /** TODO Implement */
  async function SaveData(hotel: Hotel) {
    console.log(hotel);
  }
</script>

<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    v-model:selection="selectedHotels"
    hide-selection-checkbox
    :api-result="hotels"
    :on-load="LoadData"
    :data="hotels?.result"
    :item-id="(item: Hotel) => item.id"
    navigation-item-id="HotelEdit"
    new
    new-emit
    :new-title="t('New hotel').toString()"
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec quam id nunc tincidunt vulputate sed eget ex. Praesent bibendum leo sed ipsum sodales euismod. Cras ac purus volutpat, dapibus quam eget, vestibulum orci. Aliquam et ligula pharetra, condimentum nibh at, congue dolor."
    @click:new="console.log('New Button Clicked: ' + $event)"
    v-model:display-options="displayOptions"
  >
    <template #toolbar>
      <v-btn>Knop 1</v-btn>
      <v-btn>Knop 2</v-btn>
    </template>

    <template #overflowMenuActions>
      <v-list-item>Knop 3</v-list-item>
    </template>

    <template #thead>
      <mk-th v-model:sorting="sorting" :sorting-options="{ id: 'name' }">{{ t("Name") }}</mk-th>
      <mk-th v-model:sorting="sorting" :sorting-options="{ id: 'created' }">{{ t("Created") }}</mk-th>
      <th>{{ t("Country") }}</th>
      <th>{{ t("Active") }}</th>
      <th>{{ t("SRP") }}</th>
      <th></th>
    </template>

    <template #tbody="dataItem: Hotel">
      <td>{{ dataItem.name }}</td>
      <td>{{ formatDateTime(dataItem.created) }}</td>
      <mk-td @click.stop>
        <v-autocomplete
          v-model="dataItem.countryCode"
          :items="countryOptions"
          hide-details
          @update:model-value="(code: string) => onCountryCodeChanged(dataItem, code)"
        />
      </mk-td>
      <mk-td :value="dataItem.isActive" />
      <mk-td :value="dataItem.srp" />
      <mk-td :value="srpIcon(dataItem)" />
    </template>
  </mk-table>
</template>
