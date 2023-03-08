<script lang="ts">
  import { defineComponent } from "vue";

  // import SampleTable2 from './samples/SampleTable2.vue';
  export default defineComponent({
    name: "Home",
    setup() {
      return {};
    },
  });
</script>

<template>
  <v-lazy :min-height="5000" :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card class="ma-5">
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </v-card>
  </v-lazy>
</template>
