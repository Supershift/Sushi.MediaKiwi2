<script setup lang="ts">
  import { ListResult, IconsLibrary, Paging, TableCellIcon, TableIconPosition, TableFilter, TableFilterType, TableFilterValue, TableMap } from "@/models";

  import { MkTable } from "@/components";
  import { useI18next } from "@/composables";

  import { ref } from "vue";
  import { sampleApi, Country, HotelDto } from "@sample/services";

  // inject dependencies
  const { formatDateTime, t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const hotels = ref<ListResult<HotelDto>>();
  const countries = ref<Country[]>();

  // define mapping
  function srpIcon(item: HotelDto): TableCellIcon {
    return {
      position: item.srp ? TableIconPosition.Append : TableIconPosition.Prepend,
      iconName: item.srp ? IconsLibrary.checkCircleOutline : IconsLibrary.accountCircle,
      tooltip: item.srp ? "SRP" : "NoSRP",
      label: item.srp ? "SRP correct" : "Define SRP",
    };
  }
  const tableMap: TableMap<HotelDto> = {
    itemId: (item) => item.id!,
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
    navigation-item-id="HotelEdit"
    title="Subtitle for the hotel list"
  >
    <template #toolbar>
      <v-btn>Knop 1</v-btn>
      <v-btn>Knop 2</v-btn>
    </template>

    <template #overflowMenuActions>
      <v-list-item>Knop 3</v-list-item>
    </template>
  </mk-table>
</template>
