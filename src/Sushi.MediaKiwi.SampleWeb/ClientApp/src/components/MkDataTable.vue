<script setup lang="ts">

import { ITableMap } from '../models/ITableMap';


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
                <td v-for="mapItem in props.map.items">
                    <!-- render the result for calling 'value()'-->
                    <template v-if="mapItem.value !== undefined">
                        <!-- render a boolean -->
                        <template v-if="typeof (mapItem.value(item)) === 'boolean'">
                            <v-icon v-if="mapItem.value(item)" icon="mdi-check-circle-outline" />
                            <v-icon v-else icon="mdi-close-circle-outline" />
                        </template>
                        <!-- render any other value -->
                        <template v-else>{{ mapItem.value(item) }}</template>
                    </template>
                    <!-- render a dynamic component-->
                    <template v-else="mapItem.Component !== undefined">
                        <component :is="mapItem.component" :item="item"></component>
                    </template>
                </td>
            </tr>
        </tbody>
    </v-table>
    <slot name="footer"></slot>
</template>