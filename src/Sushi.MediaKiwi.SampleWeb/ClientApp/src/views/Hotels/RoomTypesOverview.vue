<!-- eslint-disable prettier/prettier -->
<script setup lang="ts">
  import { Country } from "@/models/Country";
  import { Hotel } from "@/models/Hotel";
  import { Paging, MkEmptyState } from "@supershift/mediakiwi-vue";

  import { ListResult, MkTable, useI18next, Sorting, SortDirection, type Scrolling, type ScrollLoad, useBreadcrumbs } from "@supershift/mediakiwi-vue";

  import { ref } from "vue";

  // inject dependencies
  const { t } = await useI18next();
  const { setCustomPageTitle } = useBreadcrumbs();

  // define reactive variables
  setCustomPageTitle("Demo infinite scrolling");
  const currentPagination = ref<Paging>({});
  const initialized = ref(false);
  const roomTypes = ref<ListResult<any>>({
    pageCount: 1,
    totalCount: 14,
    result: [
      { id: 1, name: "Single", active: true },
      { id: 2, name: "Double", active: true },
      { id: 3, name: "Triple", active: true },
      { id: 4, name: "Triple", active: true },
      { id: 5, name: "Triple", active: true },
      { id: 6, name: "Triple", active: true },
      { id: 7, name: "Triple", active: true },
      { id: 8, name: "Triple", active: true },
      { id: 9, name: "Triple", active: true },
      { id: 10, name: "Triple", active: true },
      { id: 11, name: "Triple", active: true },
      { id: 12, name: "Triple", active: true },
      { id: 13, name: "Triple", active: true },
      { id: 14, name: "Triple", active: true },
    ],
  });
  const mockedMore = [
    { id: 15, name: "Single", active: true },
    { id: 16, name: "Double", active: true },
    { id: 17, name: "Triple", active: true },
    { id: 18, name: "Quadrupple", active: true },
    { id: 19, name: "Quadrupple", active: true },
    { id: 20, name: "Quadrupple", active: true },
    { id: 21, name: "Quadrupple", active: true },
    { id: 22, name: "Quintopple", active: true },
    { id: 23, name: "Quintopple", active: true },
    { id: 24, name: "Quintopple", active: true },
    { id: 25, name: "Quintopple", active: true },
    { id: 26, name: "Quintopple", active: true },
    { id: 27, name: "Quintopple", active: true },
    { id: 28, name: "Quintopple", active: true },
  ];

  const scrollSettings = ref<Scrolling>({
    height: 200,
    mode: "intersect",
    side: "both",
    emptyText: "No more data to load!!!",
  });
  /** Load more triggered, mocked api */
  function loadMore({ done }: ScrollLoad) {
    console.log("loaded more");
    if (initialized.value === false) {
      setTimeout(() => {
        roomTypes.value.totalCount = mockedMore.length + roomTypes.value.result.length;
        roomTypes.value.result.push(...mockedMore);
        done('ok');
      }, 2000);
      initialized.value = true;
    } else {
      done('empty')
    }
  }
</script>

<template>
  <mk-table
    v-if="roomTypes?.result?.length"
    v-model:current-pagination="currentPagination"
    :data="roomTypes?.result"
    new
    :item-id="(item: any) => item.id"
    item-view-id="RoomTypesEdit"
    title="Subtitle for the hotel list"
    :scrolling="scrollSettings"
    @update:load="(e: ScrollLoad) => loadMore(e)"
  >
    <template #thead>
      <th>{{ t("Room Type") }}</th>
      <th>{{ t("Active") }}</th>
    </template>

    <template #tbody="dataItem: any">
      <td>{{ dataItem.name }}</td>
      <td>{{ dataItem.active }}</td>
    </template>
    <template #sloading>
      <v-progress-circular indeterminate></v-progress-circular>
    </template>
  </mk-table>

  <MkEmptyState v-else new item-view-id="RoomTypesEdit" new-title="New" title="Test empty list title"></MkEmptyState>
</template>
