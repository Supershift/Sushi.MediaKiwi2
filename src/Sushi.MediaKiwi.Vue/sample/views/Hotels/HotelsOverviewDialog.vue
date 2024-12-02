<script setup lang="ts">
  import { Country } from "./../../models/Country";
  import { Hotel } from "./../../models/Hotel";
  import { CountryConnector } from "./../../services/CountryConnector";
  import { HotelConnector } from "./../../services/HotelConnector";
  import { IconsLibrary, Paging, TableCellIcon, TableIconPosition, ListResult } from "@/models";

  import { MkTable, MkTd } from "@/components";
  import { useI18next } from "@/composables";

  import { container } from "tsyringe";
  import { ref } from "vue";
  import { TableDisplayOptions } from "@/models/table/TableDisplayOptions";
  import MkFormDialog from "@/components/MkForm/MkFormDialog.vue";

  // inject dependencies
  const connector = container.resolve(HotelConnector);
  const countriesConnector = container.resolve(CountryConnector);
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>();
  const hotels = ref<ListResult<Hotel>>();
  const countries = ref<Country[]>();
  const selectedHotels = ref<Hotel[]>([]);

  // Set the name column to be hidden by default, the user can change this in the display options
  const hiddenColumns = ["hotelName", "srp"];
  const displayOptions = ref<TableDisplayOptions>({
    columns: [...hiddenColumns.map((id) => ({ id, visible: false }))],
  });

  // load data
  async function LoadData() {
    const response = await connector.GetAllAsync(currentPagination.value);

    const hotelItems = response.result.map((item) => {
      // convert to Hotel class
      return new Hotel(item);
    });

    hotels.value = { ...response, result: hotelItems };
  }

  // Load countries
  countries.value = (await countriesConnector.GetAll({ pageIndex: 0, pageSize: 9999 })).result;

  function onClose() {
    selectedHotels.value = [];
  }
</script>

<template>
  <MkFormDialog @close="onClose">
    <mk-table
      :api-result="hotels"
      v-model:selection="selectedHotels"
      @load="LoadData"
      :item-id="(item) => item.id"
      :remove-item-selection="(item) => item.countryCode !== 'NL'"
      hide-selection-checkbox
      hide-bulk-action-bar
    >
      <template #thead>
        <th>{{ t("Name") }}</th>
        <th width="100" mk-column-id="isActive">{{ t("Active") }}</th>
      </template>

      <template #tbody="{ dataItem }">
        <td>{{ dataItem.name }}</td>
        <mk-td :value="dataItem.isActive" />
      </template>
    </mk-table>
  </MkFormDialog>
</template>
