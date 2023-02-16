<script setup lang="ts">
import { useRouter, type RouteParamsRaw } from 'vue-router';
import type { ITableMap } from '@/models/table/ITableMap';
import MkTableCell from './MkTableCell.vue';
import { store } from '@/stores/mediakiwi/mediakiwi';

const props = defineProps<{
    tableMap: ITableMap<any>,
    data: any[],
    /** Name of the IScreen instance to which the user is pushed when clicking a row */
    itemScreenName?: string
}>();

const emit = defineEmits<{
    (e: 'click:row', value: any): void
}>()

const router = useRouter();

function onRowClick(event: Event, dataItem: any) {
    // emit event
    emit('click:row', dataItem);

    // navigate user to target page if defined
    if (props.itemScreenName !== undefined) {
        // find navigation item for the screen
        let screen = store.screens.find(x => x.name == props.itemScreenName);
        if (screen === undefined) {
            throw new Error(`No screen found for name ${props.itemScreenName}`);
        }
        let navigationItem = store.navigationItems.find(x => x.screenId == screen?.id);
        if (navigationItem === undefined) {
            throw new Error(`No navigationItem found for screen ${props.itemScreenName}`);
        }

        // try to resolve route parameter
        let routeParams = <RouteParamsRaw>{};
        if (navigationItem.itemParamName !== undefined) {
            if (props.tableMap.itemId === undefined) {
                throw new Error(`No itemId function found to resolve ${navigationItem.itemParamName}`);
            }
            let itemId = props.tableMap.itemId(dataItem);
            if (itemId === undefined) {
                throw new Error(`No value returned by itemId function`);
            }
            routeParams[navigationItem.itemParamName] = itemId;
        }

        router.push({ name: navigationItem.name, params: routeParams });
    }
}

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
            <tr v-for="dataItem in props.data" @click="(e) => onRowClick(e, dataItem)" style="cursor: pointer;">
                <!-- render a cell for each mapping item -->
                <MkTableCell v-for="mapItem in props.tableMap.items" :data="dataItem" :map-item="mapItem">
                </MkTableCell>
            </tr>
        </tbody>
    </v-table>

</template>