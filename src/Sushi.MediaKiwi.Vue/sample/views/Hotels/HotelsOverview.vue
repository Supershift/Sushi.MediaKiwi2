<script setup lang="ts">
  import {
    IconsLibrary,
    Paging,
    Sorting,
    SortDirection,
    TableCellIcon,
    TableIconPosition,
    TableFilter,
    TableFilterType,
    TableFilterValue,
    ListResult,
  } from "@/models";

  import { MkTable, MkTh, MkTd } from "@/components";
  import { useI18next, useFilterInQuery } from "@/composables";
  import { DateTime } from "luxon";

  import { reactive, ref } from "vue";
  import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";
  import { useSampleApi, Country, HotelDto, MoneyValue } from "@sample/services";
  import { useSnackbarStore } from "@/stores";
  import AddHotelDialog from "./AddHotelDialog.vue";
  import HotelsOverviewDialog from "./HotelsOverviewDialog.vue";

  // inject dependencies
  const sampleApi = useSampleApi();
  const { formatDateTime, t } = await useI18next();
  const snackbar = useSnackbarStore();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const hotels = ref<ListResult<HotelDto>>();
  const countries = ref<Country[]>();
  const countryOptions = ref<TableFilterValue[]>([]);
  const selectedHotels = ref<HotelDto[]>([]);

  const state = reactive({
    addDialog: false,
    selectionDialog: false,
  });

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

    // Load countries
    countries.value = (await sampleApi.countries({ pageIndex: 0, pageSize: 9999 })).data.result;

    // Set filter options
    filters.value.countryCode.options = countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code });
    countryOptions.value = countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code });
  }

  // create a sorting option object with a default value
  const sorting = ref<Sorting>({
    sortBy: "name",
    sortDirection: SortDirection.Desc,
  });

  async function onCountryCodeChanged(hotel: HotelDto) {
    // Update the hotel object
    const result = await sampleApi.hotelUpdate(hotel.id!, hotel);
    if (result) {
      snackbar.showMessage(`Sucessfully saved ${hotel.name}`);
    }
  }

  function srpFormatted(srp?: MoneyValue): string {
    if (srp) return Intl.NumberFormat("en", { style: "currency", currency: srp.currency }).format(srp.amount);
    else return "";
  }

  useFilterInQuery(filters, currentPagination, sorting);
</script>

<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:filters="filters"
    v-model:sorting="sorting"
    :api-result="hotels"
    v-model:selection="selectedHotels"
    :on-load="LoadData"
    :item-id="(item) => item.id!"
    navigation-item-id="HotelEdit"
    new
    new-emit
    :new-title="t('New hotel').toString()"
    title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin nec quam id nunc tincidunt vulputate sed eget ex. Praesent bibendum leo sed ipsum sodales euismod. Cras ac purus volutpat, dapibus quam eget, vestibulum orci. Aliquam et ligula pharetra, condimentum nibh at, congue dolor."
    @click:new="state.addDialog = true"
    v-model:display-options="displayOptions"
    :remove-item-selection="(item) => item.countryCode !== 'NL'"
    hide-selection-checkbox
  >
    <template #toolbar>
      <v-btn @click="state.selectionDialog = true">Open dialog</v-btn>
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
      <th mk-column-id="srp" class="srp-column">{{ t("SRP") }}</th>
      <th mk-column-id="srpValue" :mk-column-label="t('SRP Icon')"></th>
    </template>

    <template #tbody="{ dataItem }">
      <td>{{ dataItem.name }}</td>
      <td>{{ formatDateTime(dataItem.created, DateTime.DATETIME_MED_WITH_SECONDS) }}</td>
      <mk-td @click.stop>
        <v-autocomplete v-model="dataItem.countryCode" :items="countryOptions" hide-details @update:model-value="() => onCountryCodeChanged(dataItem)" />
      </mk-td>
      <mk-td :value="dataItem.isActive" />
      <td>{{ srpFormatted(dataItem.srp) }}</td>
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

  <AddHotelDialog v-model="state.addDialog" @update:model-value="LoadData" />
  <HotelsOverviewDialog v-model="state.selectionDialog"></HotelsOverviewDialog>
</template>

<style scoped lang="scss">
  .srp-column {
    width: 100px;
  }
</style>
