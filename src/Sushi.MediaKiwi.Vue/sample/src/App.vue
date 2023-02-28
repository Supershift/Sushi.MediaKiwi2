<script setup lang="ts">
  import { MkNavigation } from "@supershift/mediakiwi-vue";
  import { MkScreen } from "@supershift/mediakiwi-vue";
  // import Screen1 from "./components/Screen1.vue";
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar title="MediaKiwi 2.0" elevation="20"></v-app-bar>
      <mk-navigation></mk-navigation>
      <mk-screen></mk-screen>
      <!-- <Screen1></Screen1> -->
    </v-layout>
  </v-card>
</template>
