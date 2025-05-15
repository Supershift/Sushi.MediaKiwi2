<script setup lang="ts">
  import { useFilters, useI18next } from "@/composables";
  import { TableFilter, TableFilterItem } from "@/models";
  import MkInputChip from "../MkChip/MkInputChip.vue";
  import { computed } from "vue";
  import { flattenFilter } from "@/helpers/filter/flattenFilter";

  // Inject dependencies
  const { appliedFilterChip } = await useFilters(useI18next("MkFilter"));

  // holds the current filter being edited and its value
  const props = defineProps<{
    tableFilter: TableFilter;
    onChangeCurrentFilter: (key: string, selectedFilter: TableFilterItem) => void;
    onRemoveFilter: (key: string) => void;
  }>();

  const items = computed(() => flattenFilter(props.tableFilter));
</script>
<template>
  <template v-for="key in Object.keys(items)">
    <MkInputChip
      v-if="items[key].selectedValue"
      :key="key"
      @click="onChangeCurrentFilter(key, items[key])"
      @click:remove="onRemoveFilter(key)"
      :closable="items[key].closable ?? true"
    >
      {{ appliedFilterChip(items[key]) }}
    </MkInputChip>
  </template>
</template>
