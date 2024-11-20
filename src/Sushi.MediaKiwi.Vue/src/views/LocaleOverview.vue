<script setup lang="ts">
  import { TableMap, Locale, ListResult, Paging } from "@/models";
  import { useI18next } from "@/composables";
  import { ref } from "vue";
  import { MkTable } from "@/components";
  import { useMediaKiwiApi } from "@/services";

  // inject dependencies
  const { defaultT } = await useI18next();
  const mediaKiwiApi = useMediaKiwiApi();

  // define reactive variables
  const data = ref<ListResult<Locale>>();
  const currentPagination = ref<Paging>({});

  // define mapping
  const tableMap: TableMap<Locale> = {
    itemId: (x) => x.id,
    items: [
      { headerTitle: "Id", value: (x) => x.id },
      { headerTitle: defaultT.value("Name"), value: (x) => x.name },
      { headerTitle: defaultT.value("IsEnabled"), value: (x) => x.isEnabled },
    ],
  };

  // get data
  async function onLoad() {
    data.value = (await mediaKiwiApi.locales({ ...currentPagination.value, onlyEnabled: false })).data;
  }
</script>
<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    :table-map="tableMap"
    new
    :api-result="data"
    :on-load="onLoad"
    navigation-item-id="MkLocaleEdit"
  ></mk-table>
</template>
