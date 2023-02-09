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
                <th v-for="mapItem in props.map.Items">{{ mapItem.HeaderTitle }}</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in props.data">
                <td v-for="mapItem in props.map.Items">
                    <template v-if="typeof(mapItem.Value(item)) === 'boolean'">
                        <v-icon v-if="mapItem.Value(item)" icon="mdi-check-circle-outline" />
                        <v-icon v-else icon="mdi-close-circle-outline" />
                    </template>
                    <template v-else>{{ mapItem.Value(item) }}</template>
                </td>
            </tr>
        </tbody>
    </v-table>
    <slot name="footer"></slot>
</template>