<script setup lang="ts">
import type { ITableFilter, ITableMap, TableFilterValueCollection } from '@/models/table/';

import MkTableFilter from './MkTableFilter.vue';
import MkTableView from './MkTableView.vue';

const props = defineProps<{
    filterMap?: ITableFilter,
    selectedFilters?: TableFilterValueCollection,
    tableMap: ITableMap<any>,
    data: any[]
}>();

const emit = defineEmits<{
    (e: 'update:selectedFilters', value: TableFilterValueCollection): void
}>()

const hasFilter = props.filterMap !== undefined && props.selectedFilters !== undefined;

</script>

<template>
    <slot name="header"></slot>
    <template v-if="hasFilter">
        <MkTableFilter 
            :filter-map="<ITableFilter>filterMap" 
            :model-value="<TableFilterValueCollection>selectedFilters"
            @update:model-value="(e) => emit('update:selectedFilters', e)">
        </MkTableFilter>
    </template>
    <MkTableView :table-map="tableMap" :data="data"></MkTableView>
    <slot name="footer"></slot>
</template>