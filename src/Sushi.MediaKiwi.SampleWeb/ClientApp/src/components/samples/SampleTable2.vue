<script setup lang="ts">
import { reactive } from 'vue'
import MkTableView from '@/components/table/MkTableView.vue';
import type { ITableMap } from '@/models/table/ITableMap';
import type { ITableFilterValue } from '@/models/table/ITableFilterValue';
import type { ITableFilterItem } from '@/models/table/ITableFilterItem';
import MkTableFilter from '../table/MkTableFilter.vue';
import MkTableFilterTextField from '../table/MkTableFilterTextField.vue'
import MkTableFilterSelect from '../table/MkTableFilterSelect.vue'
import SampleCustomTableFilterInput from './SampleCustomTableFilterInput.vue';
import { stringifyExpression } from '@vue/compiler-core';

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

const selectedFilters = reactive(new Map<string, ITableFilterValue>());


</script>

<template>
    
    <MkTableFilter :filter-mapping="filters" v-model="selectedFilters"></MkTableFilter>
    
    <MkTableView :map="myMap" :data="orders">
        <template v-slot:header>
            <h1>Orders</h1>
        </template>        
    </MkTableView>

    <button @click="orders[0].total += 100">Ophogen</button>
    
</template>