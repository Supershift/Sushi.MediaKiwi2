<script setup lang="ts">
  import { reactive, ref } from "vue";
  import { AccountConnector } from "@sample/services/AccountConnector";
  import { container } from "tsyringe";
  import { CreateAccountRequest } from "@sample/models/Account/CreateAccountRequest";
  import { useValidationRules } from "@/composables";
  import MkFormDialog from "@/components/MkForm/MkFormDialog.vue";

  const connector = container.resolve(AccountConnector);
  const { required } = useValidationRules();

  const state = reactive({
    title: "Create Account",
    account: <CreateAccountRequest>{
      number: <string | undefined>undefined,
      holderName: <string | undefined>undefined,
    },
    isSuccessful: false,
  });

  async function onSubmit() {
    const candidate = await connector.CreateAccountAsync(state.account!);
    state.account = candidate!;
    if (state.account.number) {
      state.isSuccessful = true;
    }
  }
</script>
<template>
  <MkFormDialog confirm-before-submit @submit="onSubmit" title="Create Account">
    <v-text-field label="Account Number" v-model="state.account.number" :rules="[required]" />
    <v-text-field label="Holder Name" v-model="state.account.holderName" :rules="[required]" />
  </MkFormDialog>
</template>
