<script lang="ts">
// import SampleTable1 from './samples/SampleTable1.vue';

import { defineComponent } from 'vue';

// import SampleTable2 from './samples/SampleTable2.vue';
export default defineComponent({
    name: "Home",
    setup() {
        return {

        }
    }
})
</script>

<template>
    <v-lazy
    :min-height="5000"
    :options="{'threshold':0.5}"
    transition="fade-transition">
        <v-card>
            <h1>TESST</h1>
            <!-- <SampleTable1></SampleTable1>
            <SampleTable2></SampleTable2> -->
        </v-card>
    </v-lazy>
</template>