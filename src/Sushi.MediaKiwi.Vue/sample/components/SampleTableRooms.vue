<script setup lang="ts">
  import { Country } from "./../models/Country";
  import { SampleRooms } from "./../models/SampleRooms";
  import { CountryConnector } from "./../services/CountryConnector";

  import { MkTable } from "@/components";
  import { Paging, TableFilter, TableFilterType, TableFilterValue, TableMap } from "@/models";
  import { useI18next } from "@/composables";

  import { container } from "tsyringe";
  import { ref } from "vue";

  // inject dependencies
  const countriesConnector = container.resolve(CountryConnector);
  const availableRooms = [
    {
      id: 1,
      roomNr: 101,
      level: 1,
      name: "Double suite",
      country: "NL",
      duration: 30,
      roomCode: "D1",
      earlyCheckIn: "2021-10-1",
      isActive: false,
    },
    {
      id: 2,
      roomNr: 102,
      level: 1,
      name: "Single suite",
      country: "NL",
      duration: 30,
      roomCode: "S1",
      earlyCheckIn: "2021-10-21",
      isActive: false,
    },
    {
      id: 3,
      roomNr: 803,
      level: 1,
      name: "Penthouse suite",
      country: "NL",
      duration: 30,
      roomCode: "P1",
      earlyCheckIn: "2021-10-10",
      isActive: false,
    },
  ];
  const { formatDateTime, t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const countries = ref<Country[]>();

  // define mapping
  const tableMap: TableMap<SampleRooms> = {
    itemId: (item) => item.id,
    items: [
      { headerTitle: t.value("Active"), value: (item) => item.isActive },
      { headerTitle: t.value("Rooms"), value: (item) => item.roomNr },
      { headerTitle: t.value("Level"), value: (item) => item.level },
      { headerTitle: t.value("Check-in"), value: (item) => formatDateTime.value(item.earlyCheckIn) },
      { headerTitle: t.value("Duration"), value: (item) => item.duration },
      { headerTitle: t.value("Room code"), value: (item) => item.roomCode },
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
  });

  // load data
  async function LoadData() {
    console.log("LoadData");
  }

  // Load countries
  countries.value = (await countriesConnector.GetAll({ pageIndex: 0, pageSize: 9999 })).result;

  // Set filter options
  filters.value.countryCode.options = countries.value?.map(({ code, name }) => <TableFilterValue>{ title: name, value: code });
</script>

<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    v-model:filters="filters"
    :table-map="tableMap"
    :on-load="LoadData"
    :data="availableRooms"
    item-view-id="RoomsEdit"
  >
  </mk-table>
</template>
