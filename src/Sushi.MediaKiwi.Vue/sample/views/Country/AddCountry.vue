<script setup lang="ts">
  import MkFormDialog from "@/components/MkForm/MkFormDialog.vue";
  import { useValidationRules } from "@/composables";
  import { Country } from "@sample/services";
  import { reactive } from "vue";

  // Inject dependencies
  const model = defineModel({ type: Boolean, default: false });
  const { required, maxLength } = await useValidationRules();

  const state = reactive({
    country: <Country>{},
  });

  async function save() {
    throw new Error("Not implemented");
  }
</script>
<template>
  <MkFormDialog v-model="model" title="Add a country" @submit="save">
    <v-text-field v-model="state.country.code" label="Code" required :rules="[required, maxLength(2)]"></v-text-field>
    <v-text-field v-model="state.country.name" label="Name" required :rules="[required]"></v-text-field>
  </MkFormDialog>
</template>
