<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import MkTableView from './table/MkTableView.vue';
import MkForm from './form/MkForm.vue'
import type { ITableMap, ITableMapItem } from '@/models/table';
import { SampleDataService } from './samples/SampleDataService';
import type { ISampleData } from './samples/ISampleData';
import { reactive } from 'vue';

const route = useRoute();
const router = useRouter();

const countries = [{ title: 'Nederland', value: 'NL' }, { title: 'België', value: 'BE' }];

function onButtonClick() {
    router.push({
        name: 'Sample-deep-data-edit',
        params: {
            sampleDataId: route.params.sampleDataId,
            deepDataId: 'abcd-124'
        }
    })
}

const deepData = [
    { id: 'abc-123', name: 'hello' },
    { id: 'dfh-235', name: 'good' },
    { id: 'dfsdg', name: 'bye' }];

const myMap = <ITableMap<any>>{
    itemId: (item) => item.id ,
    items: [
        { headerTitle: "Name", value: (dataItem) => dataItem.name },
    ]
}

var candidate = SampleDataService.Get(Number(route.params.sampleDataId));

var state = reactive({
    data: candidate ? candidate : <ISampleData>{}
});
    

function onSave(){
    SampleDataService.Save(state.data);    
}

function onUndo(){
    candidate = SampleDataService.Get(Number(route.params.sampleDataId));
    state.data = candidate ? candidate : <ISampleData>{};
}

</script>

<template>    
    <MkForm title="Sample data edit" @save="onSave" @undo="onUndo">
        <v-text-field label="Name" v-model="state.data.name" ></v-text-field>
        <v-select label="Country Code" v-model="state.data.countryCode" :items="countries" ></v-select>        
    </MkForm>    
    <v-divider></v-divider>
    Manually go a level deeper: <v-btn @click="onButtonClick">Level deeper</v-btn>
    <v-divider></v-divider>
    Use a table to go a level deeper:
    <MkTableView :data="deepData" :table-map="myMap" item-screen-name="SampleDeepDataEdit"></MkTableView>
</template>