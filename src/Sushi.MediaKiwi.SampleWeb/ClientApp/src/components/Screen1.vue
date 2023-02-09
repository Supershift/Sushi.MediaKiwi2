<script setup lang="ts">
import MkDataTable from './MkDataTable.vue';
import type { ITableMap } from '../models/ITableMap';

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
    Items: [
        { HeaderTitle: "ID", Value: (entity) => entity.id },
        { HeaderTitle: "Naam", Value: (entity) => entity.name },
        { HeaderTitle: "Voorraad", Value: (entity) => entity.inStock },
        { HeaderTitle: "Prijs", Value: (entity) => entity.price },
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