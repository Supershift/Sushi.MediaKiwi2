<script setup lang="ts">
  import { Country } from "@/models/Country";
  import { Hotel } from "@/models/Hotel";
  import { CountryConnector } from "@/services/CountryConnector";
  import { HotelConnector } from "@/services/HotelConnector";
  import { ListResult, MkTable, TableFilter, TableFilterType, TableFilterValue, TableMap } from "@supershift/mediakiwi-vue";
  import { container } from "tsyringe";
  import { ref } from "vue";

  // inject dependencies
  const connector = container.resolve(HotelConnector);
  const countriesConnector = container.resolve(CountryConnector);
  
  // define reactive variables
  const currentPage = ref(0);
  const hotels = ref<ListResult<Hotel>>();
  const countries = ref<Country[]>();

  // define mapping
  const tableMap: TableMap<Hotel> = {
    itemId: (item) => item.id,
    items: [
      { headerTitle: "Name", value: (item) => item.name },
      { headerTitle: "Country", value: (item) => countries.value!.find((x) => x.code == item.countryCode)?.name },
      { headerTitle: "Active", value: (item) => item.isActive }
    ],
  };

  // define filters
  const filters = ref<TableFilter>({
    isActive: {
      title: "Active",
      type: TableFilterType.RadioGroup,
      options:[
        { title: "Yes", value: true},
        { title: "No", value: false}
      ]
    },
    countryCode:{
      title: "Country",
      type: TableFilterType.Select,
      options: []
    }
  });

  // load data
  async function LoadData() {
    hotels.value = await connector.GetAllAsync({ pageIndex: currentPage.value }, filters.value.countryCode.selectedValue?.value, filters.value.isActive.selectedValue?.value);
  }

  // Load countries
  countries.value = (await countriesConnector.GetAll({pageIndex: 0, pageSize: 9999 })).result; 
  
  // Set filter options
  filters.value.countryCode.options = countries.value?.map(({ code, name }) => <TableFilterValue>{title:name, value:code});

</script>

<template>
  <mk-table 
  :new="true"
  :api-result="hotels" 
  :table-map="tableMap" 
  :on-load="LoadData" 
  v-model:current-page="currentPage" 
  v-model:filters="filters"
  :data="hotels?.result"
  item-view-id="HotelEdit"></mk-table>
</template>
