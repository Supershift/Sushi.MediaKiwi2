<script lang="ts">
  import { defineComponent } from "vue";
  import { MkBreadcrumbs } from "@supershift/mediakiwi-vue";

  // import SampleTable2 from './samples/SampleTable2.vue';
  export default defineComponent({
    name: "Home",
    components: {
      MkBreadcrumbs
    },
    setup() {
      return {};
    }
  });
</script>

<template>
  <mk-breadcrumbs />

  <v-lazy
    :options="{ threshold: 0.5 }"
    transition="fade-transition"
  >
    <v-card class="ma-5">
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </v-card>
  </v-lazy>
</template>
