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
    useI18next,
    TableBodySlotResult,
    MkTh,
    MkTd,
    Sorting,
    SortDirection,
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
    new
    :api-result="hotels"
    :on-load="LoadData"
    :data="hotels?.result"
    :item-id="(item: Hotel) => item.id"
    item-view-id="HotelEdit"
    title="Subtitle for the hotel list"
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
      <mk-th>{{ t("Country") }}</mk-th>
      <mk-th>{{ t("Active") }}</mk-th>
      <mk-th>{{ t("SRP") }}</mk-th>
      <mk-th></mk-th>
    </template>

    <template #tbody="{ dataItem }: TableBodySlotResult<Hotel>">
      <mk-td @click.stop>
        <v-text-field v-model="dataItem.name" @update:model-value="(name:string) => onNameChanged(dataItem, name)" />
      </mk-td>
      <mk-td :value="formatDateTime(dataItem.created)" />
      <mk-td @click.stop>
        <v-autocomplete
          v-model="dataItem.countryCode"
          :items="countryOptions"
          hide-details
          @update:model-value="(code:string) => onCountryCodeChanged(dataItem, code)"
        />
      </mk-td>
      <mk-td :value="dataItem.isActive" />
      <mk-td :value="dataItem.srp" />
      <mk-td :value="srpIcon(dataItem)" />
    </template>
  </mk-table>
</template>
