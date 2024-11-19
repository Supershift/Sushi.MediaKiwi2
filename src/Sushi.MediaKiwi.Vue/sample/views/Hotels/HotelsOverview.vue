<script setup lang="ts">
  import { Country } from "./../../models/Country";
  import { Hotel } from "./../../models/Hotel";
  import { CountryConnector } from "./../../services/CountryConnector";
  import { HotelConnector } from "./../../services/HotelConnector";
  import { IconsLibrary, Paging, Sorting, SortDirection, TableCellIcon, TableIconPosition, TableFilter, TableFilterType, TableFilterValue } from "@/models";

  import { MkTable, MkTh, MkTd } from "@/components";
  import { useI18next } from "@/composables";

  import { container } from "tsyringe";
  import { ref } from "vue";
  import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";
  import { useSnackbarStore } from "@/stores";

  // inject dependencies
  const connector = container.resolve(HotelConnector);
  const countriesConnector = container.resolve(CountryConnector);
  const { formatDateTime, t } = await useI18next();
  const snackbar = useSnackbarStore();

  // define reactive variables
  const currentPagination = ref<Paging>({
    pageIndex: 0,
    pageSize: 11,
  }); // demos 11 items per page (higher than default 10), also adds to the current list
  const hotels = ref<Hotel[]>([]);
  const countries = ref<Country[]>();
  const selectedHotels = ref<Hotel[]>([]);

  // Set the name column to be hidden by default, the user can change this in the display options
  const hiddenColumns = ["hotelName", "srp"];
  const displayOptions = ref<TableDisplayOptions>({
    columns: [...hiddenColumns.map((id) => ({ id, visible: false }))],
  });

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
    const result = await connector.GetAllAsync(
      currentPagination.value,
      filters.value.countryCode.selectedValue?.value,
      filters.value.isActive.selectedValue?.value
    );

    hotels.value = result.result.map((item) => {
      // convert to Hotel class
      return new Hotel(item);
    });
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

  async function onCountryCodeChanged(hotel: Hotel) {
    // Update the hotel object
    const result = await connector.SaveAsync(hotel);
    if (result) {
      snackbar.showMessage(`Sucessfully saved ${hotel.name}`);
    }
  }
</script>

<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    :data="hotels"
    v-model:selection="selectedHotels"
    :on-load="LoadData"
    :item-id="(item) => item.id"
    navigation-item-id="HotelEdit"
    new
    new-emit
    :new-title="t('New hotel').toString()"
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec quam id nunc tincidunt vulputate sed eget ex. Praesent bibendum leo sed ipsum sodales euismod. Cras ac purus volutpat, dapibus quam eget, vestibulum orci. Aliquam et ligula pharetra, condimentum nibh at, congue dolor."
    @click:new="console.log('New Button Clicked: ' + $event)"
    v-model:display-options="displayOptions"
    :remove-item-selection="(item) => item.countryCode !== 'NL'"
    hide-selection-checkbox
  >
    <template #toolbar>
      <v-btn>Knop 1</v-btn>
      <v-btn>Knop 2</v-btn>
    </template>

    <template #overflowMenuActions>
      <v-list-item>Knop 3</v-list-item>
    </template>

    <template #bulkActionBar>
      <v-btn>Move</v-btn>
      <v-btn>Delete</v-btn>
    </template>

    <template #thead>
      <mk-th mk-column-id="hotelName" v-model:sorting="sorting" :sorting-options="{ id: 'name' }">{{ t("Name") }}</mk-th>
      <mk-th mk-column-id="createdDate" v-model:sorting="sorting" :sorting-options="{ id: 'created' }">{{ t("Created") }}</mk-th>
      <th mk-column-id="countryName">{{ t("Country") }}</th>
      <th mk-column-id="isActive">{{ t("Active") }}</th>
      <th mk-column-id="srp" width="100">{{ t("SRP") }}</th>
      <th mk-column-id="srpValue" :mk-column-label="t('SRP Icon')"></th>
    </template>

    <template #tbody="{ dataItem }">
      <td>{{ dataItem.name }}</td>
      <td>{{ formatDateTime(dataItem.created) }}</td>
      <mk-td @click.stop>
        <v-autocomplete v-model="dataItem.countryCode" :items="countryOptions" hide-details @update:model-value="() => onCountryCodeChanged(dataItem)" />
      </mk-td>
      <mk-td :value="dataItem.isActive" />
      <td>{{ dataItem.srpFormatted }}</td>
      <mk-td :value="srpIcon(dataItem)" />
    </template>

    <template #contextmenu="{ dataItem, isBulkAction }">
      <v-list v-if="isBulkAction">
        <v-list-item @click="() => console.log('ccontext click')"> Move all {{ selectedHotels.length }} hotels</v-list-item>
        <v-list-item @click="() => console.log('ccontext click')"> Delete all {{ selectedHotels.length }} hotels</v-list-item>
      </v-list>
      <v-list v-else>
        <v-list-item @click="() => console.log('context click')"> Move: {{ dataItem.name! }}</v-list-item>
        <v-list-item @click="() => console.log('ccontext click')"> Delete: {{ dataItem.name! }}</v-list-item>
      </v-list>
    </template>
  </mk-table>
</template>
