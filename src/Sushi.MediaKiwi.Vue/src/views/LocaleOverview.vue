<script setup lang="ts">
  import { TableMap, Locale, ListResult, Paging } from "@/models";
  import { useI18next } from "@/composables";
  import { container } from "tsyringe";
  import { ref } from "vue";
  import { MkTable } from "@/components";
  import { Api } from "@/services";

  // inject dependencies
  const { mediakiwi: mediaKiwiApi } = container.resolve<Api<any>>("MediaKiwiApi");
  const { defaultT } = await useI18next();

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
    data.value = (await mediaKiwiApi.apiLocalesList({ ...currentPagination.value, onlyEnabled: false })).data;
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
