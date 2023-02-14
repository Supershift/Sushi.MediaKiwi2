<script setup lang="ts">
import type { ITableFilterItem, ITableFilterValue } from '@/models/table/';

const props = defineProps<{
    tableFilterItem: ITableFilterItem,
    modelValue: ITableFilterValue
}>();

const emit = defineEmits<{  
  (e: 'update:modelValue', value: ITableFilterValue): void
}>()

function textFieldChanged(selectedValue: string) {
    emit('update:modelValue', { title: selectedValue, value: selectedValue });
}

</script>

<template>    
    <v-text-field 
        :value="modelValue?.value" @update:model-value="textFieldChanged" label="Value">
    </v-text-field>
</template>