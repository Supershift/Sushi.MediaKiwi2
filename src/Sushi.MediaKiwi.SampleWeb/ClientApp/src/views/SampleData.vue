<script setup lang="ts">
  import { ref } from "vue";
  import SampleTable3 from "../components/SampleTable3.vue";
  import { MkSidePanel } from "@supershift/mediakiwi-vue";
  const toggle = ref(true);
  function handleClose() {
    toggle.value = false;
  }
  function handleToggle() {
    toggle.value = true;
  }
</script>

<template>
  <v-card class="ma-5">
    <v-btn v-if="!toggle" class="ma-5" variant="text" @click="handleToggle">Open Side Panel</v-btn>
    <SampleTable3></SampleTable3>
    <mk-side-panel :model-value="toggle" :id-name="'mk-layout'" @closed="handleClose">
      <template #header> Test </template>
      <template #default> Default </template>
      <template #footer> Footer </template>
    </mk-side-panel>
  </v-card>
</template>
