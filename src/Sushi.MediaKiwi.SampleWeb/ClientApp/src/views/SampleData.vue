<script setup lang="ts">
  import SampleTable3 from "../components/SampleTable3.vue";
  import SampleBreadcrumbs from "@/components/SampleBreadcrumbs.vue";
  const items = [
    { title: "test", href: "test" },
    { title: "test", href: "test" },
  ];
</script>

<template>
  <v-card class="ma-5">
    <SampleTable3></SampleTable3>
  </v-card>
</template>
