<script setup lang="ts">
  import { defineAsyncComponent } from "vue";
  import { MkTable } from "@mediakiwi/components";
  import type { TableMap } from "@mediakiwi/models";
  import SampleCustomCell from "./SampleCustomCell.vue";

  interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
  }
  const products = <Product[]>[
    { id: 12, name: "Football", price: 45.95, inStock: true },
    { id: 15, name: "Shirt", price: 75.95, inStock: false },
  ];

  const myMap = <TableMap<Product>>{
    items: [
      { headerTitle: "ID", value: (entity: Product) => entity.id },
      { headerTitle: "Naam", value: (entity: Product) => entity.name },
      { headerTitle: "Voorraad", value: (entity: Product) => entity.inStock },
      { headerTitle: "Prijs", value: (entity: Product) => entity.price },
      { headerTitle: "Custom", value: (entity: Product) => entity.name, component: SampleCustomCell },
      {
        headerTitle: "Custom 2",
        value: (entity: Product) => entity.name,
        component: defineAsyncComponent(() => import("@/components/SampleCustomCell.vue")),
      },
    ],
  };
</script>

<template>
  <MkTable :table-map="myMap" :data="products">
    <template v-slot:header>
      <h1>I am the table</h1>
    </template>
    <template v-slot:footer>
      <p>You know, I am the footer.</p>
    </template>
  </MkTable>
</template>
