<script setup lang="ts">
import type { ITableMap } from '@/models/table/ITableMap';
import MkTableCell from './MkTableCell.vue';

const props = defineProps<{
    tableMap: ITableMap<any>,
    data: any[]
}>();

</script>

<template>
    
    <v-table>
        <thead>
            <tr>
                <!-- render a header cell for each mapping item -->
                <th v-for="mapItem in props.tableMap.items">{{ mapItem.headerTitle }}</th>
            </tr>
        </thead>
        <tbody>
            <!-- render a row for each provided data entity -->
            <tr v-for="dataItem in props.data">
                <!-- render a cell for each mapping item -->
                <MkTableCell 
                    v-for="mapItem in props.tableMap.items" 
                    :data="dataItem"
                    :map-item="mapItem">
                </MkTableCell>
            </tr>
        </tbody>
    </v-table>
    
</template>