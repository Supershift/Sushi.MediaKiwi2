<script setup lang="ts">
import { reactive, computed } from 'vue'
import MkTable from '../table/MkTable.vue';
import type { ITableMap, ITableFilterItem } from '@/models/table/';
import { TableFilterValueCollection } from '@/models/table/';
import MkTableFilterTextField from '../table/MkTableFilterTextField.vue'
import MkTableFilterSelect from '../table/MkTableFilterSelect.vue'
import SampleCustomTableFilterInput from './SampleCustomTableFilterInput.vue';
import type { ISampleData } from './ISampleData';
import { SampleDataService } from './SampleDataService';

const myMap = <ITableMap<ISampleData>>{
    items: [
        { headerTitle: "Naam", value: (dataItem) => dataItem.name },
        { headerTitle: "Land", value: (dataItem) => dataItem.countryName },
    ]
}

const filters = <ITableFilterItem[]>[
    {
        id: 'Name',
        title: 'Naam',
        component: MkTableFilterTextField
    },
    {
        id: 'Country',
        title: 'Land',
        options: [{ title: 'Nederland', value: 'NL' }, { title: 'België', value: 'BE' }],
        component: MkTableFilterSelect
    },
    {
        id: 'FullName',
        title: 'Volledige naam',
        component: SampleCustomTableFilterInput
    },
];

const selectedFilters = reactive(new TableFilterValueCollection());
const sampleData = computed(() => SampleDataService.GetAll(selectedFilters.get('Country')?.value));
</script>

<template>
    <MkTable :filter-mapping="filters" v-model:selected-filters="selectedFilters" :table-map="myMap" :data="sampleData">
    </MkTable>
</template>