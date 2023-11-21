<script setup lang="ts">
  import { Country } from "@/models/Country";
  import { Hotel } from "@/models/Hotel";
  import { Paging, MkEmptyState } from "@supershift/mediakiwi-vue";

  import { ListResult, MkTable, useI18next, Sorting, SortDirection } from "@supershift/mediakiwi-vue";

  import { ref } from "vue";

  // inject dependencies
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const roomTypes = ref<ListResult<any>>();

  // load data
  async function LoadData() {
    roomTypes.value = <ListResult<any>>{};
  }

  function onNewButtonClick() {
    alert("ok");
  }
</script>

<template>
  <mk-table
    v-if="roomTypes?.result?.length > 0"
    v-model:current-pagination="currentPagination"
    :api-result="roomTypes"
    :on-load="LoadData"
    :data="roomTypes?.result"
    new
    :item-id="(item: any) => item.id"
    item-view-id="HotelEdit"
    title="Subtitle for the hotel list"
    @click:new="console.log('New Button Clicked: ' + $event)"
  >
    <template #thead>
      <th>{{ t("Room Type") }}</th>
      <th>{{ t("Active") }}</th>
      <th></th>
    </template>

    <template #tbody="dataItem: any">
      <td>{{ dataItem.name }}</td>
      <td>{{ dataItem.active }}</td>
    </template>
  </mk-table>

  <MkEmptyState v-else new item-view-id="HotelEdit"></MkEmptyState>
</template>
