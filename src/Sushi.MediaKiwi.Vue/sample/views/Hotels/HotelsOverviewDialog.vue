<script setup lang="ts">
  import { Paging, ListResult } from "@/models";

  import { MkTable, MkTd } from "@/components";
  import { useI18next } from "@/composables";

  import { ref } from "vue";
  import MkFormDialog from "@/components/MkForm/MkFormDialog.vue";
  import { Country, HotelDto, useSampleApi } from "@sample/services";

  // inject dependencies
  const modelValue = defineModel({ type: Boolean, default: false });
  const sampleApi = useSampleApi();
  const { t } = await useI18next();

  // define reactive variables
  const currentPagination = ref<Paging>();
  const hotels = ref<ListResult<HotelDto>>();
  const countries = ref<Country[]>();
  const selectedHotels = ref<HotelDto[]>([]);

  // load data
  async function LoadData() {
    hotels.value = (await sampleApi.hotel({ ...currentPagination.value })).data;
  }

  function onClose() {
    selectedHotels.value = [];
  }

  async function onOpen() {
    // Load countries
    countries.value = (await sampleApi.countries({ pageIndex: 0, pageSize: 9999 })).data.result;
  }
</script>

<template>
  <MkFormDialog v-model="modelValue" @close="onClose" @update:modelValue="(value) => (value ? onOpen() : onClose())">
    <mk-table
      :api-result="hotels"
      v-model:selection="selectedHotels"
      @load="LoadData"
      :item-id="(item) => item.id!"
      :remove-item-selection="(item) => item.countryCode !== 'NL'"
      hide-selection-checkbox
      hide-bulk-action-bar
    >
      <template #thead>
        <th>{{ t("Name") }}</th>
        <th mk-column-id="isActive" class="isactive-column">{{ t("Active") }}</th>
      </template>

      <template #tbody="{ dataItem }">
        <td>{{ dataItem.name }}</td>
        <mk-td :value="dataItem.isActive" />
      </template>
    </mk-table>
  </MkFormDialog>
</template>

<style scoped lang="scss">
  .isactive-column {
    width: 100px;
  }
</style>
