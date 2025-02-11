<script setup lang="ts">
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
  import { useI18next, useFilterInQuery } from "@/composables";
  import { DateTime } from "luxon";

  import { ref } from "vue";
  import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";
  import { useSampleApi, Country, HotelDto } from "@sample/services";

  // inject dependencies
  const sampleApi = useSampleApi();
  const { formatDateTime, t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({
    pageIndex: 0,
    pageSize: 11,
  }); // demos 11 items per page (higher than default 10), also adds to the current list
  const hotels = ref<ListResult<HotelDto>>();
  const countries = ref<Country[]>();

  // Set the name column to be hidden by default, the user can change this in the display options
  const hiddenColumns = ["hotelName", "srp"];
  const displayOptions = ref<TableDisplayOptions>({
    columns: [...hiddenColumns.map((id) => ({ id, visible: false }))],
  });

  // define mapping
  function srpIcon(item: HotelDto): TableCellIcon {
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
    hotels.value = (
      await sampleApi.hotel({
        countryCode: filters.value.countryCode.selectedValue?.value,
        isActive: filters.value.isActive.selectedValue?.value,
        ...currentPagination.value,
      })
    ).data;
  }

  // Load countries
  countries.value = (await sampleApi.countries({ pageIndex: 0, pageSize: 9999 })).data.result;

  // Set filter options
  filters.value.countryCode.options = countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code });
  const countryOptions = countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code });

  // create a sorting option object with a default value
  const sorting = ref<Sorting>({
    sortBy: "name",
    sortDirection: SortDirection.Desc,
  });

  useFilterInQuery(filters, currentPagination, sorting);

  async function onNameChanged(hotel: HotelDto, name: string) {
    hotel.name = name;
    await SaveData(hotel);
  }

  async function onCountryCodeChanged(hotel: HotelDto, code: string) {
    hotel.countryCode = code;
    await SaveData(hotel);
  }

  /** TODO Implement */
  async function SaveData(hotel: HotelDto) {
    console.log(hotel);
  }
</script>

<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    :api-result="hotels"
    :on-load="LoadData"
    :data="hotels?.result"
    :item-id="(item: HotelDto) => item.id!"
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
      <mk-th mk-column-id="hotelName" v-model:sorting="sorting" :sorting-options="{ id: 'name' }">{{ t("Name") }}</mk-th>
      <mk-th mk-column-id="createdDate" v-model:sorting="sorting" :sorting-options="{ id: 'created' }">{{ t("Created") }}</mk-th>
      <th mk-column-id="countryName">{{ t("Country") }}</th>
      <th mk-column-id="isActive">{{ t("Active") }}</th>
      <th mk-column-id="srp" width="100">{{ t("SRP") }}</th>
      <th mk-column-id="srpValue" :mk-column-label="t('SRP Icon')"></th>
    </template>

    <template #tbody="dataItem: HotelDto">
      <td>{{ dataItem.name }}</td>
      <td>{{ formatDateTime(dataItem.created, DateTime.DATETIME_MED_WITH_SECONDS) }}</td>
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
