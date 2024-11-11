<script setup lang="ts">
  import { reactive } from "vue";
  import { useValidationRules } from "@/composables";
  import MkFormDialog from "@/components/MkForm/MkFormDialog.vue";
  import { sampleApi, AccountDto } from "@sample/services";

  const { required, minLength } = await useValidationRules();

  const state = reactive({
    title: "Create Account",
    account: <AccountDto>{
      number: <string | undefined>undefined,
      holderName: <string | undefined>undefined,
    },
    isSuccessful: false,
  });

  async function onSubmit() {
    const candidate = (
      await sampleApi.accountCreateAccountCreate({
        number: state.account.number ?? "??",
        holderName: state.account.holderName ?? "??",
      })
    ).data;
    state.account = candidate!;
    if (state.account.number) {
      state.isSuccessful = true;
    }
  }
</script>
<template>
  <MkFormDialog width="800" confirm-before-submit @submit="onSubmit" title="Create Account">
    <v-text-field label="Account Number" v-model="state.account.number" :rules="[required, minLength(3)]" />
    <v-text-field label="Holder Name" v-model="state.account.holderName" :rules="[required]" />
  </MkFormDialog>
</template>
