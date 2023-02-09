<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import MkDataTable from '@/components/table/MkDataTable.vue';
import type { ITableMap } from '@/models/table/ITableMap';
import SampleCustomCell from '@/components/samples/SampleCustomCell.vue';

interface Product {
    id: number,
    name: string,
    price: number,
    inStock: boolean
}
const products = <Product[]>[
    { id: 12, name: 'Football', price: 45.95, inStock: true },
    { id: 15, name: 'Shirt', price: 75.95, inStock: false }
]

const myMap = <ITableMap<Product>>{
    items: [
        { headerTitle: "ID", value: (entity) => entity.id },
        { headerTitle: "Naam", value: (entity) => entity.name },
        { headerTitle: "Voorraad", value: (entity) => entity.inStock },
        { headerTitle: "Prijs", value: (entity) => entity.price },
        { headerTitle: "Custom", component: SampleCustomCell },
        { headerTitle: "Custom 2", component: defineAsyncComponent(() =>  import('@/components/samples/SampleCustomCell.vue')) },
    ]
}
</script>

<template>
    <MkDataTable :map="myMap" :data="products">
        <template v-slot:header>
            <h1>I am the table</h1>
        </template>
        <template v-slot:footer>
            You know, I am the footer.
        </template>
    </MkDataTable>
</template>