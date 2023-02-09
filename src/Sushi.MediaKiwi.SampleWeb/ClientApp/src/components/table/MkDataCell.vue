<script setup lang="ts">
    import { ITableMapItem } from '@/models/table/ITableMapItem';
    
    defineProps<{
        item: any,
        mapItem: ITableMapItem<any>
    }>();
</script>

<template>    
    <td>
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
</template>