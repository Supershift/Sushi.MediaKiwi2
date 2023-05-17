<script setup lang="ts">
  import SampleTable3 from "../components/SampleTable3.vue";
</script>

<template>
  <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card>
      <SampleTable3></SampleTable3>
    </v-card>
  </v-lazy>
</template>
