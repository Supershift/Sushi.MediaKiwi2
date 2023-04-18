<script setup lang="ts"></script>

<template>
  <v-lazy :options="{ threshold: 0.5 }" transition="fade-transition">
    <v-card class="ma-5">
      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>
    </v-card>
  </v-lazy>
</template>
