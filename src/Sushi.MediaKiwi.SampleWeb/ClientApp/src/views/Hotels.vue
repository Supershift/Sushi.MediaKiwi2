<script setup lang="ts">
  import SampleTable3 from "../components/SampleTable3.vue";
</script>

<template>
  <v-lazy :min-height="5000" :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card class="ma-5">
      <h1>MyComponent 2</h1>

      <SampleTable3></SampleTable3>
    </v-card>
  </v-lazy>
</template>
