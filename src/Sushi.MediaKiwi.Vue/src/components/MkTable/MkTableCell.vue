<script setup lang="ts">
import type { ITableMapItem } from '@/models/table/ITableMapItem';

const props = defineProps<{
    data: any,
    mapItem: ITableMapItem<any>
}>();

function invokeMapItemValue(mapItem: ITableMapItem<any>) {
    if (mapItem?.value !== undefined) {
        return mapItem.value(props.data);
    }
    else {
        return undefined;
    }
}
</script>

<template>
    <td>
        <!-- render a dynamic component-->
        <template v-if="mapItem.component !== undefined">
            <component :is="mapItem.component" :data="invokeMapItemValue(mapItem)"></component>
        </template>
        <!-- render the result for calling 'value()'-->
        <template v-else>
            <!-- render a boolean -->
            <template v-if="typeof (invokeMapItemValue(mapItem)) === 'boolean'">
                <v-icon v-if="invokeMapItemValue(mapItem)" icon="mdi-check-circle-outline" />
                <v-icon v-else icon="mdi-close-circle-outline" />
            </template>
            <!-- render any other value -->
            <template v-else>{{ invokeMapItemValue(mapItem) }}</template>
        </template>
    </td>
</template>