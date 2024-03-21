<script setup lang="ts">
  import SunbedDialog from "@sample/components/SunbedDialog.vue";
  import { MkToolbar, useI18next } from "@/framework";
  import { ref } from "vue";

  const { t } = await useI18next();

  const dialog = ref<boolean>(false);

  function openDialog() {
    dialog.value = true;
  }
  function closeDialog() {
    dialog.value = false;
  }
</script>
<template>
  <MkToolbar title="Sunbeds">
    <template #toolbar>
      <v-btn variant="flat" @click="openDialog"> {{ t("Open Dialog") }}</v-btn>
    </template>
  </MkToolbar>

  <v-dialog v-model="dialog" width="50%" height="75%">
    <SunbedDialog @click:close="closeDialog" />
  </v-dialog>
</template>
