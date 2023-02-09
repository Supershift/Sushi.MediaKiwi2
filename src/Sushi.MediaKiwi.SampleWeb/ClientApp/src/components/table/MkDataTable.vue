<script setup lang="ts">

import { ITableMap } from '@/models/table/ITableMap';
import MkDataCell from './MkDataCell.vue';

const props = defineProps<{
    map: ITableMap<any>,
    data: any[]
}>();

</script>

<template>
    <slot name="header"></slot>
    <v-table>
        <thead>
            <tr>
                <!-- render a header cell for each mapping item -->
                <th v-for="mapItem in props.map.items">{{ mapItem.headerTitle }}</th>
            </tr>
        </thead>
        <tbody>
            <!-- render a row for each provided data entity -->
            <tr v-for="item in props.data">
                <!-- render a cell for each mapping item -->
                <MkDataCell 
                    v-for="mapItem in props.map.items" 
                    :item="item"
                    :map-item="mapItem">
                </MkDataCell>
            </tr>
        </tbody>
    </v-table>
    <slot name="footer"></slot>
</template>