<script setup lang="ts">
import type { ITableFilterItem } from '@/models/table/ITableFilterItem';
import type { ITableFilterValue } from '@/models/table/ITableFilterValue';

const props = defineProps<{
    tableFilterItem: ITableFilterItem,
    modelValue: ITableFilterValue
}>();

const emit = defineEmits(['update:modelValue']);

function selectChanged(selectedValue: ITableFilterValue) {
    emit('update:modelValue', selectedValue);
}

</script>

<template>
    
    <!-- render a select -->
    <v-select :items="tableFilterItem.options"
         label="Kies" return-object @update:model-value="selectChanged">
    </v-select>
</template>