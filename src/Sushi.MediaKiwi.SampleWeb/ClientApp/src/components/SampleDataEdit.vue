<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import MkTableView from './table/MkTableView.vue';
import type { ITableMap, ITableMapItem } from '@/models/table';

const route = useRoute();
const router = useRouter();

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

</script>

<template>
    <h1>Sample data edit</h1>
    <p>
        My id is: {{ route.params.sampleDataId }}
    </p>
    <v-btn @click="onButtonClick">Level deeper</v-btn>
    <br>
    <MkTableView :data="deepData" :table-map="myMap" item-screen-name="SampleDeepDataEdit"></MkTableView>
</template>