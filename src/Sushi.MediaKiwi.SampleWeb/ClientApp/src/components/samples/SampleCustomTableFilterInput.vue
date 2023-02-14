<script setup lang="ts">
import { ref } from 'vue';
import type { ITableFilterItem } from '@/models/table/ITableFilterItem';
import type { ITableFilterValue } from '@/models/table/ITableFilterValue';

const props = defineProps<{
    tableFilterItem: ITableFilterItem,
    modelValue: ITableFilterValue
}>();

const emit = defineEmits(['update:modelValue']);


function firstNameChanged(firstName: string){
    emit('update:modelValue', {
        title: firstName + ' ' + props.modelValue?.value?.surName,
        value: { firstName: firstName, surName: props.modelValue?.value?.surName }
    });
}

function surNameChanged(surName: string){
    emit('update:modelValue', {
        title: props.modelValue?.value?.firstName + ' ' + surName,
        value: { firstName: props.modelValue?.value?.firstName, surName: surName }
    });
}



</script>

<template>
    <v-text-field :value="modelValue?.value.firstName" @update:model-value="firstNameChanged" label="Voornaam">
    </v-text-field>

    <v-text-field :value="modelValue?.value.surName" @update:model-value="surNameChanged" label="Achternaam">
    </v-text-field>
</template>