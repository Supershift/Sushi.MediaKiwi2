<script setup lang="ts">
  import { MkTable, MkTd } from "@/components";
  import MkForm from "@/components/MkForm/MkForm.vue";
  import { useBreadcrumbs, useI18next, useNavigation } from "@/composables";
  import { ListResult, Paging } from "@/models";
  import { useRoomTypes } from "@sample/composables/useRoomTypes";
  import { RoomType } from "@sample/models/Hotel/RoomType";
  import { computed, reactive, ref } from "vue";

  // inject dependencies
  const { t } = await useI18next();
  const navigation = useNavigation();
  const roomTypeId = computed(() => navigation.currentViewParameterNumber.value);
  const { getRoomType, getAllBoardTypes } = useRoomTypes();

  // define reactive variables
  const currentPagination = ref<Paging>({});
  const state = reactive({
    roomType: <any>{},
    boardTypes: <ListResult<RoomType>>{},
  });

  async function load() {
    state.roomType = getRoomType(roomTypeId.value);
  }

  async function loadBoardTypes() {
    state.boardTypes = getAllBoardTypes();
  }
</script>

<template>
  <MkForm @load="load">
    <v-text-field label="Name" v-model="state.roomType.name"></v-text-field>
  </MkForm>

  <mk-table
    v-model:current-pagination="currentPagination"
    :api-result="state.boardTypes"
    :data="state.boardTypes?.result"
    :item-id="(item) => item.id"
    navigation-item-id="RoomTypesEditDeep"
    title="Board Types"
    @load="loadBoardTypes"
  >
    <template #thead>
      <th>{{ t("Board Type") }}</th>
      <th>{{ t("Active") }}</th>
    </template>

    <template #tbody="dataItem">
      <td>{{ dataItem.name }}</td>
      <MkTd :value="dataItem.active"></MkTd>
    </template>
  </mk-table>
</template>
