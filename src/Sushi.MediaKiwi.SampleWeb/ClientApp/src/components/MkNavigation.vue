<script setup lang="ts">

const navigationItems = [
    { id: 1, name: "Hotels", screenId: 1, typeId: 1 },
    { id: 2, name: "Customers", screenId: 2, typeId: 1 },
    { id: 3, name: "Something else", screenId: 3, typeId: 1 },
]

const emit = defineEmits(['change'])

</script>

<template>
    <v-navigation-drawer>
        <v-list>
            <v-list-item v-for="navigationItem in navigationItems" :value="navigationItem.id"
                @click="$emit('change', navigationItem.screenId)">
                {{ navigationItem.name }}
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

