<script setup lang="ts">
  import { MkSidePanel } from "@supershift/mediakiwi-vue";
  import { ref } from "vue";

  const toggle = ref(true);
  function handleClose() {
    toggle.value = false;
  }
  function handleToggle() {
    toggle.value = true;
  }
</script>

<template>
  <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card class="ma-5">
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </v-card>
  </v-lazy>
  <v-btn v-if="!toggle" class="ma-5 d-inline-block" variant="text" @click="handleToggle">Open Side Panel</v-btn>
  <mk-side-panel :model-value="toggle" :id-name="'mk-layout'" @closed="handleClose">
    <template #header> Home Page Panel </template>
    <template #default>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ac turpis mollis, finibus dolor ut, blandit magna. Sed et nibh mollis, porta lorem at, placerat nibh. Sed faucibus ac justo
      quis suscipit. Quisque id ipsum ligula. Sed eros nibh, dapibus a imperdiet sit amet, condi
    </template>
    <template #footer>
      <v-btn class="d-inline-block" variant="text">action 1</v-btn>
      <v-btn class="d-inline-block" variant="text">action 2</v-btn>
    </template>
  </mk-side-panel>
</template>
