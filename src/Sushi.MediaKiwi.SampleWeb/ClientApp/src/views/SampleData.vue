<script setup lang="ts">
  import SampleTable3 from "../components/SampleTable3.vue";
  import SampleBreadcrumbs from "@/components/SampleBreadcrumbs.vue";
  const items = [
    { title: "test", href: "test" },
    { title: "test", href: "test" },
  ];
</script>

<template>
  <p class="ml-5 text-green">Correct breadcrumbs top.</p>
  <br />
  <p class="ml-5 text-orange">
    Demo 'vanilla' breadcrumbs below. Vanilla works since the breadcrumb is generated using the 'items' prop of v-breadcrumbs instead of the v-breadcrumbs-item, which means the slot is overwritten
    with the custom divider, but this also means that the truncate code cannot be added.
  </p>
  <v-breadcrumbs :items="items" class="ml-5">
    <template #divider>
      <v-icon icon="mdi-chevron-right"></v-icon>
    </template>
  </v-breadcrumbs>
  <sample-breadcrumbs></sample-breadcrumbs>
  <v-card class="ma-5">
    <SampleTable3></SampleTable3>
  </v-card>
</template>
