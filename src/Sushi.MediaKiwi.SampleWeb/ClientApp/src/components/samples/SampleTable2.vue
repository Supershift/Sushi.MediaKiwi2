<script setup lang="ts">
import { reactive } from 'vue'
import MkDataTable from '@/components/table/MkDataTable.vue';
import type { ITableMap } from '@/models/table/ITableMap';

interface Customer
{
    address: string,
    name: string
}

interface Order {
    id: number,
    orderNumber: string,
    total: number,
    customer: Customer
}

const orders = reactive(<Order[]>[
    { id: 12, orderNumber: '20230001', total: 500.95, customer: { name: 'Jack Sparerib', address: 'Rum Island'} },
    { id: 15, orderNumber: '20230002', total: 235.95, customer: { name: 'Pino', address: 'Sesamstraat'} },
])

const myMap = <ITableMap<Order>>{
    items: [        
        { headerTitle: "Nummer", value: (order) => order.orderNumber },
        { headerTitle: "Totaal", value: (order) => order.total },
        { headerTitle: "Klant naam", value: (order) => order.customer.name },
        { headerTitle: "Adres", value: (order) => order.customer.address}        
    ]
}
</script>

<template>
    <MkDataTable :map="myMap" :data="orders">
        <template v-slot:header>
            <h1>Orders</h1>
        </template>        
    </MkDataTable>

    <button @click="orders[0].total += 100">Ophogen</button>
    
</template>