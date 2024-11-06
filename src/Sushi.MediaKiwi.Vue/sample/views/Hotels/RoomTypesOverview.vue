<script setup lang="ts">
  import { Paging, ListResult } from "@/models";
  import { MkTable, MkTd } from "@/components";
  import { useI18next } from "@/composables";

  import { reactive, ref } from "vue";
  import { RoomType } from "@sample/models/Hotel/RoomType";
  import { useRoomTypes } from "@sample/composables/useRoomTypes";

  // inject dependencies
  const { t } = await useI18next();
  const { getAllRoomTypes } = useRoomTypes();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const state = reactive({
    roomTypes: <ListResult<RoomType>>{},
  });

  async function load() {
    state.roomTypes = getAllRoomTypes();
  }
</script>

<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    @load="load"
    :data="state.roomTypes?.result"
    :item-id="(item) => item.id"
    navigation-item-id="RoomTypesEdit"
  >
    <template #thead>
      <th>{{ t("Room Type") }}</th>
      <th>{{ t("Active") }}</th>
    </template>

    <template #tbody="{ dataItem }">
      <td>{{ dataItem.name }}</td>
      <MkTd :value="dataItem.active"></MkTd>
    </template>
  </mk-table>
</template>
