<script setup lang="ts">
  import { MkForm } from "@/components";
  import { useBreadcrumbs, useNavigation } from "@/composables";
  import { useRoomTypes } from "@sample/composables/useRoomTypes";
  import { computed, reactive } from "vue";

  const navigation = useNavigation();
  const boardTypeId = computed(() => navigation.currentViewParameterNumber.value);
  const { getBoardType } = useRoomTypes();
  const { setCurrentBreadcrumbLabel } = useBreadcrumbs();

  const state = reactive({
    boardType: <any>{},
  });

  async function onLoad() {
    state.boardType = getBoardType(boardTypeId.value);

    setCurrentBreadcrumbLabel(state.boardType.name);
  }
</script>
<template>
  <MkForm @load="onLoad">
    <v-text-field label="Name" v-model="state.boardType.name"></v-text-field>
  </MkForm>
</template>
