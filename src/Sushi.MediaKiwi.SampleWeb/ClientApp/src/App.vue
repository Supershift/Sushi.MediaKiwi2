<script setup lang="ts">
  import MkNavigation from "@/components/MkNavigation.vue";
  import MkScreen from "@/components/MkScreen.vue";
</script>

<template>
  <v-card>
    <v-layout>
      <v-app-bar title="Application bar"></v-app-bar>

      <MkNavigation></MkNavigation>
      <MkScreen></MkScreen>
    </v-layout>
  </v-card>
</template>
