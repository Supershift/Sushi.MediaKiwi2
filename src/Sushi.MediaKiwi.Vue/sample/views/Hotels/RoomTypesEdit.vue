<script setup lang="ts">
  import MkForm from "@/components/MkForm/MkForm.vue";
  import { useBreadcrumbs, useNavigation } from "@/composables";
  import { ListResult } from "@/models";
  import { useRoomTypes } from "@sample/composables/useRoomTypes";
  import { RoomType } from "@sample/models/Hotel/RoomType";
  import { computed, reactive } from "vue";

  // inject dependencies
  const navigation = useNavigation();
  const roomTypeId = computed(() => navigation.currentViewParameterNumber.value);
  const { getRoomType } = useRoomTypes();
  const { setCurrentBreadcrumbLabel } = useBreadcrumbs();

  // define reactive variables
  const state = reactive({
    roomType: <any>{},
    boardTypes: <ListResult<RoomType>>{},
  });

  async function load() {
    state.roomType = getRoomType(roomTypeId.value);
    setCurrentBreadcrumbLabel(state.roomType.name);
  }
</script>

<template>
  <MkForm @load="load">
    <v-text-field label="Name" v-model="state.roomType.name"></v-text-field>
  </MkForm>
</template>
