<script setup async lang="ts">
import SampleTable1 from './samples/SampleTable1.vue';
import SampleTable2 from './samples/SampleTable2.vue';
</script>

<template>
    <v-card v-lazy>
        <SampleTable1></SampleTable1>
        <SampleTable2></SampleTable2>
    </v-card>
</template>