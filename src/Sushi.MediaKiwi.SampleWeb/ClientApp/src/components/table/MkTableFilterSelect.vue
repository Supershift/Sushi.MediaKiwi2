<script setup lang="ts">
import type { ITableFilterItem, ITableFilterValue } from '@/models/table/';

const props = defineProps<{
    tableFilterItem: ITableFilterItem,
    modelValue: ITableFilterValue
}>();

const emit = defineEmits<{  
  (e: 'update:modelValue', value: ITableFilterValue): void
}>()

function selectChanged(selectedValue: ITableFilterValue) {
    emit('update:modelValue', selectedValue);
}

</script>

<template>    
    <v-select :items="tableFilterItem.options"
         label="Kies" return-object @update:model-value="selectChanged">
    </v-select>
</template>