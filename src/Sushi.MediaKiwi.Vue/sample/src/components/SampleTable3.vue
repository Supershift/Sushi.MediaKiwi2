<script setup lang="ts">
import { reactive, computed } from 'vue'
import { MkTable } from '@supershift/mediakiwi-vue';
import type { ITableMap, ITableFilter, ITableFilterItem } from '@supershift/mediakiwi-vue';
import { TableFilterValueCollection } from '@supershift/mediakiwi-vue';
import { MkTableFilterTextField } from '@supershift/mediakiwi-vue'
import { MkTableFilterSelect } from '@supershift/mediakiwi-vue'
import SampleCustomTableFilterInput from './SampleCustomTableFilterInput.vue';
import type { ISampleData } from './ISampleData';
import { SampleDataService } from './SampleDataService';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// define a mapping between source data and desired columns in the table
const myMap = <ITableMap<ISampleData>>{
    itemId: (item) => { console.log(item); return item.id; },
    items: [
        { headerTitle: "Naam", value: (dataItem) => dataItem.name },
        { headerTitle: "Land", value: (dataItem) => dataItem.countryName },
    ]
}

// define filters for the data
const filters = <ITableFilter>{
    items: [
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
    ]
};

// create an object which will hold selected filter values
const selectedFilters = reactive(new TableFilterValueCollection());

// get the data, using the selected filters
const sampleData = computed(() => {
    // get country filter
    let country = selectedFilters.get('Country')?.value;
    // get the data
    let result = SampleDataService.GetAll(country);
    return result;
});
</script>

<template>
    <MkTable :filter-map="filters" v-model:selected-filters="selectedFilters" :table-map="myMap" :data="sampleData"
        item-screen-name="SampleDataEdit">
    </MkTable>
</template>