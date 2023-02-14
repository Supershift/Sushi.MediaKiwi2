<script setup lang="ts">
import type { ITableFilterItem } from '@/models/table/ITableFilterItem';
import type { ITableFilterValue } from '@/models/table/ITableFilterValue';

const props = defineProps<{
    tableFilterItem: ITableFilterItem,
    modelValue: ITableFilterValue
}>();

const emit = defineEmits(['update:modelValue']);

function textFieldChanged(selectedValue: string) {
    emit('update:modelValue', { title: selectedValue, value: selectedValue });
}

</script>

<template>
    <!-- render a text input -->
    <v-text-field 
        :value="modelValue?.value" @update:model-value="textFieldChanged" label="Voer in">
    </v-text-field>
</template>