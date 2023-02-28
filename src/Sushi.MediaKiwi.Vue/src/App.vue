<script setup lang="ts">
  import MkNavigation from "@/components/navigation/MkNavigation.vue";
  import MkScreen from "@/components/MkScreen.vue";
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar title="MediaKiwi 2.0" elevation="20"></v-app-bar>
      <mk-navigation></mk-navigation>
      <mk-screen></mk-screen>
    </v-layout>
  </v-card>
</template>
