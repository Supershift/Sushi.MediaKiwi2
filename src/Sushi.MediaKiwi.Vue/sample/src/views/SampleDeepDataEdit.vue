<script setup lang="ts">
  import { useRoute } from "@mediakiwi/router";

  const route = useRoute();
</script>

<template>
  <v-card>
    <h1>Sample deep data edit</h1>
    My id is: {{ route.params.deepDataId }}
  </v-card>
</template>
