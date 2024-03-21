<script setup lang="ts">
  import { Country } from "./../models/Country";
  import { ICustomerRooms } from "./../models/SampleCustomerRooms";
  import { CountryConnector } from "./../services/CountryConnector";

  import { MkTable } from "@/components";
  import { Paging, TableFilter, TableFilterType, TableFilterValue, TableMap } from "@/models";
  import { useI18next } from "@/composables";

  import { container } from "tsyringe";
  import { ref } from "vue";

  // inject dependencies
  const countriesConnector = container.resolve(CountryConnector);
  const customerRooms = [
    {
      isActive: false,
      bookingId: 1,
      name: "John Doe",
      country: "NL",
      days: 30,
      rooms: 1,
      level: 1,
      roomCode: "S1",
      checkIn: "2021-10-1",
      checkOut: "2021-10-30",
    },
    {
      isActive: false,
      bookingId: 2,
      name: "Jane Doe",
      country: "US",
      days: 14,
      rooms: 2,
      level: 1,
      roomCode: "S3",
      checkIn: "2023-10-1",
      checkOut: "2023-10-31",
    },
    {
      isActive: false,
      bookingId: 3,
      name: "Trans Doe",
      country: "CN",
      days: 21,
      rooms: 3,
      level: 1,
      roomCode: "S1",
      checkIn: "2023-10-10",
      checkOut: "2023-10-31",
    },
  ];
  const { formatDateTime, t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const countries = ref<Country[]>();

  // define mapping
  const tableMap: TableMap<ICustomerRooms> = {
    itemId: (item) => item.id,
    items: [
      { headerTitle: t.value("Active"), value: (item) => item.isActive },
      { headerTitle: t.value("Name"), value: (item) => item.name },
      { headerTitle: t.value("Bookingnr"), value: (item) => item.bookingId },
      { headerTitle: t.value("Country"), value: (item) => countries.value!.find((x) => x.code == item.country)?.name },
      { headerTitle: t.value("Check-in"), value: (item) => formatDateTime.value(item.checkIn) },
      { headerTitle: t.value("Check-out"), value: (item) => formatDateTime.value(item.checkOut) },
      { headerTitle: t.value("Days"), value: (item) => item.days },
      { headerTitle: t.value("Rooms"), value: (item) => item.rooms },
      { headerTitle: t.value("Level"), value: (item) => item.level },
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
    countryCode: {
      title: "Country",
      type: TableFilterType.Select,
      options: [],
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
    :data="customerRooms"
    item-view-id="CustomerRoomsEdit"
  >
  </mk-table>
</template>
