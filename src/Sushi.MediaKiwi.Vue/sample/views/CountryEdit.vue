<script setup lang="ts">
  import MkDialogCard from "@/components/MkDialog/MkDialogCard.vue";

  // Inject dependencies
  const model = defineModel({ type: Boolean, default: false });

  const emit = defineEmits<{
    (e: "update:modelValue", value: boolean): void;
  }>();

  function close() {
    model.value = false;
  }
</script>
<template>
  <v-dialog v-model="model" width="612" close-on-back>
    <MkDialogCard @click:close="close">
      <template #intro>
        <h1>Country</h1>
      </template>
      <template #default>
        <p>Todo - Here comes the form</p>
      </template>
    </MkDialogCard>
  </v-dialog>
</template>
