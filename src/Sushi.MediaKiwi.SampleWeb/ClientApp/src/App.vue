<script setup lang="ts">
  import { MkNavigationOld } from "@supershift/mediakiwi-vue";
  import { MkScreen } from "@supershift/mediakiwi-vue";
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar title="MediaKiwi 2.0" elevation="20"></v-app-bar>
      <mk-navigation-old></mk-navigation-old>
      <mk-screen></mk-screen>
    </v-layout>
  </v-card>
</template>
