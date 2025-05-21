<script setup lang="ts">
  import { Paging, ListResult, TableFilterType, TableFilter } from "@/models";
  import { MkTable, MkTd, MkTableFilter } from "@/components";
  import { useI18next, useNavigation, useFilterInQuery } from "@/composables";

  import { reactive, ref, watch } from "vue";
  import { RoomType } from "@sample/hotels/models/RoomType";
  import { useRoomTypes } from "@sample/hotels/composables/useRoomTypes";

  // inject dependencies
  const { t } = await useI18next();
  const { getAllRoomTypes } = useRoomTypes();
  const navigation = useNavigation();
  // define reactive variables
  const currentPagination = ref<Paging>({});
  const state = reactive({
    roomTypes: <ListResult<RoomType>>{},
  });

  const filters = ref<TableFilter>({
    popularFilters: {
      title: "Popular filters",
      type: TableFilterType.MultiSelect,
      options: [
        { title: "Wonderful: 9+", value: "wonderful" },
        { title: "4 stars", value: "4-stars" },
        { title: "Free Wifi", value: "free-wifi" },
      ],
    },
  });
  // keep filters and query params in sync
  useFilterInQuery(filters);

  async function load() {
    console.log(`Load room types for hotel ${navigation.currentViewParameter.value}`);
    const filterString = filters.value!.popularFilters!.selectedValue?.value?.toString();
    if (filterString) {
      console.log(`Applying the following filters: ${filterString}`);
    }

    state.roomTypes = getAllRoomTypes();
  }

  watch(
    filters,
    async () => {
      await load();
    },
    { deep: true }
  );
</script>

<template>
  <mk-table
    v-model:current-pagination="currentPagination"
    @load="load"
    :data="state.roomTypes?.result"
    :item-id="(item) => item.id"
    navigation-item-id="RoomTypesEdit"
  >
    <template #header>
      <!-- to swap the filter position  -->
      <MkTableFilter class="pb-0" v-model:model-value="filters" />
      <v-label class="ma-2">Table Title</v-label>
    </template>
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
