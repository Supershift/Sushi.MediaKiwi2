<script setup lang="ts">
import { propsToAttrMap } from '@vue/shared';
import { reactive } from 'vue';
import { ref } from 'vue';
enum FilterInputTypeEnum {
    Text,
    Select,
    Custom
}

interface IFilterValue {
    title: string,
    value: any
}


interface IFilterItem {
    id: string,
    title: string,
    inputType: FilterInputTypeEnum,
    selectedValue: IFilterValue | undefined,
    options: any[] | undefined
}


const filters = reactive(<IFilterItem[]>[
    {
        id: 'Name',
        title: 'Naam',
        inputType: FilterInputTypeEnum.Text
    },
    {
        id: 'Country',
        title: 'Land',
        inputType: FilterInputTypeEnum.Select,
        options: [{ title: 'Nederland', value: 'NL' }, { title: 'België', value: 'BE' }]
    }
]);

const state = reactive({ currentFilter: <IFilterItem | undefined>undefined });
let filterValue = <any | undefined>undefined;

function changeCurrentFilter(selectedFilter: IFilterItem) {
    state.currentFilter = selectedFilter;
    filterValue = undefined;
}

function applyFilter(value: IFilterValue) {
    if (state.currentFilter !== undefined) {
        state.currentFilter.selectedValue = value
    }
    filterValue = undefined;
    state.currentFilter = undefined;
}

function switchSelect(event) {
      console.log(event);
    }

</script>

<template>
    <v-toolbar>
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                    Filter
                </v-btn>
            </template>
            <v-list>
                <v-list-item v-for="filter in filters" :value="filter" @click="changeCurrentFilter(filter)">
                    <v-list-item-title>{{ filter.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <template v-for="filter in filters">
            <v-chip v-if="filter.selectedValue !== undefined">{{ filter.title }}:{{ filter.selectedValue }}</v-chip>
        </template>
    </v-toolbar>
    <v-card :title="state.currentFilter.title" v-if="state.currentFilter !== undefined">        
        <v-text-field v-if="state.currentFilter.inputType == FilterInputTypeEnum.Text" 
        
        @input="filterValue = $event.target.value"
            label="Voer in" >
        
        </v-text-field>
        <v-select v-else-if="state.currentFilter.inputType == FilterInputTypeEnum.Select" v-model="filterValue"            
            :items="state.currentFilter.options" label="Kies">
        </v-select>
        <v-card-actions>
            <v-btn @click="applyFilter()">Apply</v-btn>
        </v-card-actions>
    </v-card>
</template>