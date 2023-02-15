<script setup lang="ts">
import type { ITableFilterItem, ITableMap, TableFilterValueCollection } from '@/models/table/';

import MkTableFilter from './MkTableFilter.vue';
import MkTableView from './MkTableView.vue';

const props = defineProps<{
    filterMapping: ITableFilterItem[],
    selectedFilters: TableFilterValueCollection,
    tableMap: ITableMap<any>,
    data: any[]
}>();

const emit = defineEmits<{
    (e: 'update:selectedFilters', value: TableFilterValueCollection): void
}>()

</script>

<template>
    <MkTableFilter :filter-mapping="filterMapping" :model-value="selectedFilters"
        @update:model-value="(e) => emit('update:selectedFilters', e)"></MkTableFilter>
    <MkTableView :table-map="tableMap" :data="data"></MkTableView>
</template>