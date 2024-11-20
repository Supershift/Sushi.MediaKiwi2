<script setup lang="ts">
  import { MkTable } from "@/components";
  import { TableMap, ListResult, SectionDto, Paging } from "@/models";
  import { ref } from "vue";
  import { useMediaKiwiApi } from "@/services";

  const mediaKiwiApi = useMediaKiwiApi();

  // define reactive variables
  const data = ref<ListResult<SectionDto>>();
  const currentPagination = ref<Paging>({});

  // define mapping
  const tableMap: TableMap<SectionDto> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Id", value: (x) => x.id },
      { headerTitle: "Name", value: (x) => x.name },
      { headerTitle: "Icon", value: (x) => x.icon },
      { headerTitle: "Sort order", value: (x) => x.sortOrder },
      { headerTitle: "Roles", value: (x) => x.roles?.join() },
    ],
  };

  // get data
  async function onLoad() {
    data.value = (await mediaKiwiApi.sections({ ...currentPagination.value })).data;
  }
</script>
<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    new
    :api-result="data"
    :on-load="onLoad"
    :table-map="tableMap"
    navigation-item-id="MkSectionEdit"
  ></mk-table>
</template>
