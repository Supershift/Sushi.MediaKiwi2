<script setup lang="ts">
  import { useRoute } from "@supershift/mediakiwi-vue";

  const route = useRoute();
</script>

<template>
  <v-card class="ma-5">
    <h1>Sample deep data edit</h1>
    My id is: {{ route.params.deepDataId }}
  </v-card>
</template>
