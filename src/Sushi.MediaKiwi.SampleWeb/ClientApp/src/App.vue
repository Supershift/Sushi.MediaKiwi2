<script setup lang="ts">
  import { MkNavigation_1, MkScreen, MkSignOutButton } from "@supershift/mediakiwi-vue";
</script>

<template>
  <v-card>
    <v-layout :full-height="true" class="container">
      <v-app-bar title="MediaKiwi 2.0" elevation="20">
        <mk-sign-out-button></mk-sign-out-button>
      </v-app-bar>
      <mk-navigation_1></mk-navigation_1>
      <mk-screen></mk-screen>
    </v-layout>
  </v-card>
</template>
<style scoped lang="css">
  .container {
    height: 100vh;
  }
</style>
