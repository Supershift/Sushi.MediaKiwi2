<script setup lang="ts">
  import { MkTable, MkEmptyState } from "@/components";
  import { useI18next } from "@/composables";
  import { ListResult, Paging } from "@/models";

  import { ref } from "vue";

  // inject dependencies
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const roomTypes = ref<ListResult<any>>({
    pageCount: 1,
    totalCount: 3,
    result: [
      { id: 1, name: "Single", active: true },
      { id: 2, name: "Double", active: true },
      { id: 3, name: "Triple", active: true },
    ],
  });
</script>

<template>
  <mk-table
    v-if="roomTypes?.result?.length"
    v-model:current-pagination="currentPagination"
    :api-result="roomTypes"
    :data="roomTypes?.result"
    new
    :item-id="(item: any) => item.id"
    item-view-id="RoomTypesEditDeep"
    title="Subtitle for the hotel list"
  >
    <template #thead>
      <th>{{ t("Room Type") }}</th>
      <th>{{ t("Active") }}</th>
    </template>

    <template #tbody="dataItem: any">
      <td>{{ dataItem.name }}</td>
      <td>{{ dataItem.active }}</td>
    </template>
  </mk-table>
</template>
