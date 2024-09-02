<script setup lang="ts">
  import { useErrorMessages } from "@/composables/useErrorMessages";
  import { useSnackbarStore } from "@/stores";

  const snackbar = useSnackbarStore();
  const { unexpectedErrorMessage } = await useErrorMessages();
</script>
<template>
  <v-snackbar class="pa-0" v-model="snackbar.show">{{ snackbar.message || unexpectedErrorMessage }}</v-snackbar>
</template>
